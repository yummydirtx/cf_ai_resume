import { useState, useEffect } from 'react';
import './styles/index.css';
import ResumeInput from './components/ResumeInput';
import JobListingInput from './components/JobListingInput';
import AdditionalInfo from './components/AdditionalInfo';
import ChatInterface from './components/ChatInterface';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

function App() {
  const [step, setStep] = useState(1);
  const [resume, setResume] = useState('');
  const [jobListing, setJobListing] = useState({ content: '', isHtml: false });
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Generate session ID
    setSessionId(crypto.randomUUID());
  }, []);

  const handleStartOptimization = () => {
    if (resume && jobListing.content) {
      setIsReady(true);
      setStep(4);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title fade-in">
            <span className="gradient-text">AI Resume Optimizer</span>
          </h1>
          <p className="subtitle fade-in">
            Optimize your LaTeX resume for any job listing using Cloudflare Workers AI
          </p>
        </div>
      </header>

      <main className="main container">
        {/* Progress Indicator */}
        <div className="progress-bar fade-in">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Resume</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Job Listing</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Additional Info</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Optimize</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="content-area">
          {step === 1 && (
            <ResumeInput
              resume={resume}
              setResume={setResume}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <JobListingInput
              jobListing={jobListing}
              setJobListing={setJobListing}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              apiBase={API_BASE}
            />
          )}

          {step === 3 && (
            <AdditionalInfo
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
              onNext={handleStartOptimization}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && isReady && (
            <ChatInterface
              resume={resume}
              jobListing={jobListing}
              additionalInfo={additionalInfo}
              sessionId={sessionId}
              apiBase={API_BASE}
              onBack={() => {
                setStep(1);
                setIsReady(false);
              }}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Powered by Cloudflare Workers AI • Built with Llama 3.3</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
