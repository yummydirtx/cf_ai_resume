import { useState } from 'react';

function JobListingInput({ jobListing, setJobListing, onNext, onBack, apiBase }) {
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);

    const parseJobListing = async (content) => {
        setIsParsing(true);
        try {
            const response = await fetch(`${apiBase}/api/parse-job`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, isHtml: false }),
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
            parseJobListing(jobListing.content);
        }
    };

    return (
        <div className="glass-card slide-in" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>
                💼 Job Listing
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Copy and paste the job description below
            </p>

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
                    placeholder="Paste the job description here...&#10;&#10;Example:&#10;Software Engineer&#10;&#10;We are looking for a talented Software Engineer with experience in:&#10;- Python and JavaScript&#10;- React and Node.js&#10;- Cloud platforms (AWS/Azure)&#10;&#10;..."
                    style={{ minHeight: '350px', fontFamily: 'var(--font-body)' }}
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
                        '🔍 Analyze Job Requirements (Optional)'
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
