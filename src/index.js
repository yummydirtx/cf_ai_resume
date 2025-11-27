/**
 * Main Cloudflare Worker entry point
 * Handles API routes and WebSocket connections for the AI Resume Optimizer
 */

import { ChatSession } from './durable-objects/ChatSession.js';
export { ChatSession };

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS headers for frontend communication
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // WebSocket upgrade for chat
            if (url.pathname === '/api/chat' && request.headers.get('Upgrade') === 'websocket') {
                return handleWebSocket(request, env);
            }

            // API Routes
            if (url.pathname === '/api/parse-job') {
                return handleParseJob(request, env, corsHeaders);
            }

            if (url.pathname === '/api/preferences') {
                return handlePreferences(request, env, corsHeaders);
            }

            // Health check
            if (url.pathname === '/api/health') {
                return new Response(JSON.stringify({ status: 'ok' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            return new Response('Not Found', { status: 404, headers: corsHeaders });
        } catch (error) {
            console.error('Error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    },
};

/**
 * Handle WebSocket upgrade for chat sessions
 */
async function handleWebSocket(request, env) {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId') || crypto.randomUUID();

    // Get Durable Object instance
    const id = env.CHAT_SESSIONS.idFromName(sessionId);
    const stub = env.CHAT_SESSIONS.get(id);

    // Forward the request to the Durable Object
    return stub.fetch(request);
}

/**
 * Parse job listing (text or HTML)
 */
async function handleParseJob(request, env, corsHeaders) {
    try {
        const { content, isHtml } = await request.json();

        const { parseJobListing } = await import('./services/parser.js');
        const parsed = await parseJobListing(content, isHtml, env.AI);

        return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in handleParseJob:', error);
        return new Response(JSON.stringify({
            error: error.message,
            original: '',
            parsed: 'Error parsing job listing'
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}

/**
 * Handle user preferences (GET/POST)
 */
async function handlePreferences(request, env, corsHeaders) {
    const userId = request.headers.get('X-User-Id') || 'default';

    if (request.method === 'GET') {
        const preferences = await env.PREFERENCES.get(userId, { type: 'json' }) || {};
        return new Response(JSON.stringify(preferences), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (request.method === 'POST') {
        const preferences = await request.json();
        await env.PREFERENCES.put(userId, JSON.stringify(preferences));
        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
}
