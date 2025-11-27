import { useState } from 'react';

function ResumeInput({ resume, setResume, onNext }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setResume(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.tex') || file.type === 'text/plain')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setResume(event.target.result);
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

    return (
        <div className="glass-card slide-in" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>
                📄 Your LaTeX Resume
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Paste your LaTeX resume code or upload a .tex file
            </p>

            {/* File Upload Area */}
            <div
                className={`upload-area ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    transition: 'all var(--transition-base)',
                    backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                }}
            >
                <input
                    type="file"
                    id="resume-upload"
                    accept=".tex,text/plain"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
                <label htmlFor="resume-upload" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📤</div>
                    <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        Drop your .tex file here or click to browse
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Supports .tex and plain text files
                    </p>
                </label>
            </div>

            {/* Textarea */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label className="label" htmlFor="resume-textarea">
                    LaTeX Code
                </label>
                <textarea
                    id="resume-textarea"
                    className="textarea-field"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="\\documentclass{article}\n\\begin{document}\n...\n\\end{document}"
                    style={{ minHeight: '400px' }}
                />
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span>💡</span>
                    Your resume will be analyzed and optimized while preserving LaTeX formatting
                </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn btn-primary"
                    onClick={onNext}
                    disabled={!resume.trim()}
                    style={{ opacity: resume.trim() ? 1 : 0.5 }}
                >
                    Next: Job Listing →
                </button>
            </div>
        </div>
    );
}

export default ResumeInput;
