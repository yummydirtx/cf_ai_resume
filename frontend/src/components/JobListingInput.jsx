import { useState } from 'react';

function JobListingInput({ jobListing, setJobListing, onNext, onBack, apiBase }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.html')) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const content = event.target.result;
                setJobListing({ content, isHtml: true });
                await parseJobListing(content, true);
            };
            reader.readAsText(file);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.html')) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const content = event.target.result;
                setJobListing({ content, isHtml: true });
                await parseJobListing(content, true);
            };
            reader.readAsText(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const parseJobListing = async (content, isHtml) => {
        setIsParsing(true);
        try {
            const response = await fetch(`${apiBase}/api/parse-job`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, isHtml }),
            });
            const data = await response.json();
            setParsedData(data.parsed);
            setIsParsing(false);
        } catch (error) {
            console.error('Error parsing job listing:', error);
            setIsParsing(false);
        }
    };

    const handleTextChange = (text) => {
        setJobListing({ content: text, isHtml: false });
        setParsedData(null);
    };

    const handleParse = () => {
        if (jobListing.content) {
            parseJobListing(jobListing.content, jobListing.isHtml);
        }
    };

    return (
        <div className="glass-card slide-in" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>
                💼 Job Listing
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Paste the job description or upload an HTML file from the job site
            </p>

            {/* HTML Upload Area */}
            <div
                className={`upload-area ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    transition: 'all var(--transition-base)',
                    backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                }}
            >
                <input
                    type="file"
                    id="job-upload"
                    accept=".html"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
                <label htmlFor="job-upload" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌐</div>
                    <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        Drop HTML file here or click to browse
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Save job listing as HTML from your browser
                    </p>
                </label>
            </div>

            {/* Textarea */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label className="label" htmlFor="job-textarea">
                    Job Description
                </label>
                <textarea
                    id="job-textarea"
                    className="textarea-field"
                    value={jobListing.content}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Paste the job description here..."
                    style={{ minHeight: '300px', fontFamily: 'var(--font-body)' }}
                />
            </div>

            {/* Parse Button */}
            {jobListing.content && !parsedData && (
                <button
                    className="btn btn-secondary"
                    onClick={handleParse}
                    disabled={isParsing}
                    style={{ marginBottom: '1.5rem', width: '100%' }}
                >
                    {isParsing ? (
                        <>
                            <span className="loading"></span>
                            Analyzing job listing...
                        </>
                    ) : (
                        '🔍 Analyze Job Requirements'
                    )}
                </button>
            )}

            {/* Parsed Data Preview */}
            {parsedData && (
                <div className="fade-in" style={{
                    padding: '1.5rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    border: '1px solid var(--border-color)',
                }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>✅</span>
                        Parsed Job Information
                    </h3>
                    {typeof parsedData === 'object' ? (
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                            {parsedData.title && (
                                <p><strong>Title:</strong> {parsedData.title}</p>
                            )}
                            {parsedData.company && (
                                <p><strong>Company:</strong> {parsedData.company}</p>
                            )}
                            {parsedData.skills && parsedData.skills.length > 0 && (
                                <p><strong>Skills:</strong> {parsedData.skills.join(', ')}</p>
                            )}
                            {parsedData.keywords && parsedData.keywords.length > 0 && (
                                <p><strong>Keywords:</strong> {parsedData.keywords.join(', ')}</p>
                            )}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {parsedData}
                        </p>
                    )}
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button
                    className="btn btn-primary"
                    onClick={onNext}
                    disabled={!jobListing.content}
                    style={{ opacity: jobListing.content ? 1 : 0.5 }}
                >
                    Next: Additional Info →
                </button>
            </div>
        </div>
    );
}

export default JobListingInput;
