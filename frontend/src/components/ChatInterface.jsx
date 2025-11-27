import { useState, useEffect, useRef } from 'react';

function ChatInterface({ resume, jobListing, additionalInfo, sessionId, apiBase, onBack }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [optimizedResume, setOptimizedResume] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${apiBase.replace(/^https?:\/\//, '')}/api/chat?sessionId=${sessionId}`;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            setMessages([{
                type: 'system',
                content: 'Connected! Analyzing your resume and job listing...',
                timestamp: new Date(),
            }]);

            // Send initial data
            ws.send(JSON.stringify({
                type: 'init',
                resume,
                jobListing: jobListing.content,
                additionalInfo,
            }));

            setIsProcessing(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'system') {
                setMessages(prev => [...prev, {
                    type: 'system',
                    content: data.message,
                    timestamp: new Date(),
                }]);
            } else if (data.type === 'optimized_resume') {
                setOptimizedResume(data.content);
                setMessages(prev => [...prev, {
                    type: 'assistant',
                    content: 'Here\'s your optimized resume! I\'ve tailored it for the job listing. You can download it or ask me to make any changes.',
                    timestamp: new Date(),
                }]);
                setIsProcessing(false);
            } else if (data.type === 'chat_response') {
                // Check if response contains LaTeX code
                if (data.content.includes('\\documentclass') || data.content.includes('\\begin{document}')) {
                    setOptimizedResume(data.content);
                }
                setMessages(prev => [...prev, {
                    type: 'assistant',
                    content: data.content,
                    timestamp: new Date(),
                }]);
                setIsProcessing(false);
            } else if (data.type === 'error') {
                setMessages(prev => [...prev, {
                    type: 'error',
                    content: data.message,
                    timestamp: new Date(),
                }]);
                setIsProcessing(false);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: 'Connection error. Please try again.',
                timestamp: new Date(),
            }]);
            setIsProcessing(false);
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        return () => {
            ws.close();
        };
    }, [sessionId, resume, jobListing, additionalInfo, apiBase]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!inputMessage.trim() || !isConnected || isProcessing) return;

        const userMessage = {
            type: 'user',
            content: inputMessage,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsProcessing(true);

        wsRef.current.send(JSON.stringify({
            type: 'chat',
            message: inputMessage,
        }));

        setInputMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const downloadResume = () => {
        const blob = new Blob([optimizedResume], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized_resume.tex';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', height: '70vh' }}>
            {/* Chat Panel */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        💬 AI Assistant
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: isConnected ? '#10b981' : '#ef4444',
                        }}></div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                marginBottom: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: msg.type === 'user' ? 'var(--accent-primary)' :
                                    msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                                        'var(--bg-elevated)',
                                marginLeft: msg.type === 'user' ? '2rem' : '0',
                                marginRight: msg.type === 'user' ? '0' : '2rem',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                {msg.type === 'user' ? '👤 You' : msg.type === 'system' ? '⚙️ System' : msg.type === 'error' ? '❌ Error' : '🤖 AI'}
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isProcessing && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <span className="loading"></span>
                            AI is thinking...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        type="text"
                        className="input-field"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask for changes or refinements..."
                        disabled={!isConnected || isProcessing}
                        style={{ flex: 1 }}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || !isConnected || isProcessing}
                        style={{ opacity: inputMessage.trim() && isConnected && !isProcessing ? 1 : 0.5 }}
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Resume Preview Panel */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>📝 Optimized Resume</h2>
                    {optimizedResume && (
                        <button className="btn btn-primary" onClick={downloadResume}>
                            ⬇️ Download .tex
                        </button>
                    )}
                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}>
                    {optimizedResume || (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: 'var(--text-muted)',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                            <p>Waiting for optimized resume...</p>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <button className="btn btn-secondary" onClick={onBack} style={{ width: '100%' }}>
                        ← Start Over
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatInterface;
