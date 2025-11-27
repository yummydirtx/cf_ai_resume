/**
 * Durable Object for managing chat sessions
 * Handles WebSocket connections and LLM interactions
 */

import { generateLLMResponse, optimizeResume } from '../services/llm.js';

export class ChatSession {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Map(); // websocket -> session data
    }

    async fetch(request) {
        // Handle WebSocket upgrade
        if (request.headers.get('Upgrade') === 'websocket') {
            const pair = new WebSocketPair();
            const [client, server] = Object.values(pair);

            await this.handleSession(server);

            return new Response(null, {
                status: 101,
                webSocket: client,
            });
        }

        return new Response('Expected WebSocket', { status: 400 });
    }

    async handleSession(websocket) {
        this.state.acceptWebSocket(websocket);

        // Initialize session data
        const sessionData = {
            messages: [],
            resume: null,
            jobListing: null,
            additionalInfo: null,
            optimizedResume: null,
        };

        this.sessions.set(websocket, sessionData);

        // Load conversation history from storage
        const history = await this.state.storage.get('conversationHistory') || [];
        sessionData.messages = history;

        // Send welcome message
        websocket.send(JSON.stringify({
            type: 'system',
            message: 'Connected to AI Resume Optimizer. Please provide your resume, job listing, and any additional information to get started.',
        }));
    }

    async webSocketMessage(websocket, message) {
        try {
            const data = JSON.parse(message);
            const sessionData = this.sessions.get(websocket);

            switch (data.type) {
                case 'init':
                    // Initialize session with resume, job, and additional info
                    sessionData.resume = data.resume;
                    sessionData.jobListing = data.jobListing;
                    sessionData.additionalInfo = data.additionalInfo;

                    // Generate initial optimized resume
                    const optimized = await optimizeResume(
                        sessionData.resume,
                        sessionData.jobListing,
                        sessionData.additionalInfo,
                        this.env.AI
                    );

                    sessionData.optimizedResume = optimized;
                    sessionData.messages.push({
                        role: 'assistant',
                        content: optimized,
                    });

                    await this.persistHistory(sessionData.messages);

                    websocket.send(JSON.stringify({
                        type: 'optimized_resume',
                        content: optimized,
                    }));
                    break;

                case 'chat':
                    // User message for refinement
                    sessionData.messages.push({
                        role: 'user',
                        content: data.message,
                    });

                    // Generate response
                    const response = await generateLLMResponse(
                        sessionData.messages,
                        sessionData.resume,
                        sessionData.jobListing,
                        sessionData.additionalInfo,
                        sessionData.optimizedResume,
                        this.env.AI
                    );

                    sessionData.messages.push({
                        role: 'assistant',
                        content: response,
                    });

                    await this.persistHistory(sessionData.messages);

                    websocket.send(JSON.stringify({
                        type: 'chat_response',
                        content: response,
                    }));
                    break;

                default:
                    websocket.send(JSON.stringify({
                        type: 'error',
                        message: 'Unknown message type',
                    }));
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
            websocket.send(JSON.stringify({
                type: 'error',
                message: error.message,
            }));
        }
    }

    async webSocketClose(websocket, code, reason, wasClean) {
        this.sessions.delete(websocket);
        websocket.close(code, 'Durable Object is closing WebSocket');
    }

    async webSocketError(websocket, error) {
        console.error('WebSocket error:', error);
        this.sessions.delete(websocket);
    }

    async persistHistory(messages) {
        await this.state.storage.put('conversationHistory', messages);
    }
}
