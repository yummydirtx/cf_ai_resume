function AdditionalInfo({ additionalInfo, setAdditionalInfo, onNext, onBack }) {
    return (
        <div className="glass-card slide-in" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>
                ✨ Additional Information
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Add any skills, projects, or experience not in your resume that might be relevant
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
                <label className="label" htmlFor="additional-textarea">
                    Extra Skills, Projects, or Experience (Optional)
                </label>
                <textarea
                    id="additional-textarea"
                    className="textarea-field"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Example:&#10;&#10;Skills:&#10;- Python (Django, Flask)&#10;- Docker and Kubernetes&#10;- Machine Learning (TensorFlow, PyTorch)&#10;&#10;Projects:&#10;- Built an AI chatbot with 10k+ users&#10;- Contributed to open-source project XYZ&#10;&#10;Experience:&#10;- Freelance work in web development&#10;- Hackathon winner at ABC 2023"
                    style={{ minHeight: '350px', fontFamily: 'var(--font-body)' }}
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
                    The AI will consider this information when optimizing your resume for the job
                </p>
            </div>

            {/* Info Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Relevant Skills</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Skills that match the job but aren't prominent in your resume
                    </p>
                </div>

                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚀</div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Side Projects</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Personal or freelance projects demonstrating relevant experience
                    </p>
                </div>

                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Achievements</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Certifications, awards, or accomplishments worth highlighting
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button
                    className="btn btn-primary"
                    onClick={onNext}
                >
                    Start Optimization →
                </button>
            </div>
        </div>
    );
}

export default AdditionalInfo;
