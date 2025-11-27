# cf_ai_resume - AI Resume Optimizer

> Optimize your LaTeX resume for specific job listings using Cloudflare Workers AI (Llama 3.3)

![Cloudflare Workers AI](https://img.shields.io/badge/Cloudflare-Workers%20AI-F38020?logo=cloudflare)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)

## 🌟 Features

- **AI-Powered Optimization**: Uses Llama 3.3 (70B) to analyze job listings and tailor your resume
- **LaTeX Support**: Maintains proper LaTeX formatting while optimizing content
- **Interactive Chat**: Real-time refinement through WebSocket-powered chat interface
- **Intelligent Parsing**: Extracts requirements from text or HTML job listings
- **Multiple Input Methods**: Upload files or paste content directly
- **Stateful Sessions**: Durable Objects maintain conversation history
- **Modern UI**: Glassmorphism design with smooth animations
- **Instant Download**: Export optimized resume as .tex file

## 🏗️ Architecture

This application demonstrates all required components for the Cloudflare AI assignment:

1. **LLM**: Llama 3.3 70B Instruct (FP8) via Workers AI
2. **Workflow**: Cloudflare Workers + Durable Objects for coordination
3. **User Input**: React-based chat interface with WebSocket communication
4. **Memory/State**: Durable Objects for chat sessions + Workers KV for preferences

### Tech Stack

**Frontend:**
- Vite + React 19
- WebSocket for real-time communication
- Modern CSS with glassmorphism effects
- Deployed on Cloudflare Pages

**Backend:**
- Cloudflare Workers (serverless HTTP handlers)
- Durable Objects (WebSocket + session state)
- Workers AI (LLM inference)
- Workers KV (user preferences)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier works!)
- Wrangler CLI

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yummydirtx/cf_ai_resume.git
   cd cf_ai_resume
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Configure Wrangler**
   
   First time? Log in to Cloudflare:
   ```bash
   wrangler login
   ```
   
   Create KV namespace:
   ```bash
   wrangler kv:namespace create PREFERENCES
   ```
   
   Update `wrangler.toml` with the KV namespace ID from the output.

4. **Start development servers**
   
   In separate terminals:
   ```bash
   # Terminal 1: Backend (Workers)
   npm run dev:backend
   
   # Terminal 2: Frontend (Vite)
   npm run dev:frontend
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📖 Usage

1. **Upload/Paste Resume**: Provide your LaTeX resume (.tex file or paste code)
2. **Add Job Listing**: Copy job description or upload HTML from job site
3. **Additional Info** (Optional): Add extra skills, projects, or experience
4. **Chat & Refine**: The AI generates an optimized resume, then chat to refine it
5. **Download**: Export your optimized .tex file

### Example Workflow

```
📄 Resume Input → 💼 Job Listing → ✨ Additional Info → 💬 AI Optimization → ⬇️ Download
```

## 🌐 Deployment

### Deploy Backend (Workers)

```bash
npm run deploy:backend
```

### Deploy Frontend (Pages)

```bash
cd frontend
npm run build
wrangler pages deploy dist --project-name=cf-ai-resume
```

Or use the combined command:
```bash
npm run deploy
```

### Environment Variables

For production deployment, update `frontend/.env.production`:
```
VITE_API_URL=https://your-worker.your-subdomain.workers.dev
```

## 🎯 Project Structure

```
cf_ai_resume/
├── src/                          # Backend (Cloudflare Workers)
│   ├── index.js                 # Main Worker entry point
│   ├── durable-objects/
│   │   └── ChatSession.js       # WebSocket + chat state
│   └── services/
│       ├── llm.js               # Workers AI integration
│       └── parser.js            # Job listing parser
├── frontend/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx              # Main application
│   │   ├── components/
│   │   │   ├── ResumeInput.jsx
│   │   │   ├── JobListingInput.jsx
│   │   │   ├── AdditionalInfo.jsx
│   │   │   └── ChatInterface.jsx
│   │   └── styles/
│   │       └── index.css        # Modern dark theme
│   └── index.html
├── wrangler.toml                 # Cloudflare config
├── package.json                  # Root package file
├── README.md                     # This file
└── PROMPTS.md                    # AI prompts documentation
```

## 🤖 How It Works

### 1. Job Listing Analysis
The LLM parses job listings to extract:
- Required skills and qualifications
- Key responsibilities
- ATS keywords
- Company-specific requirements

### 2. Resume Optimization
The AI:
- Maps your experience to job requirements
- Emphasizes relevant skills
- Incorporates additional information
- Maintains LaTeX formatting
- Optimizes for ATS compatibility

### 3. Interactive Refinement
Through the chat interface:
- Request specific changes
- Ask questions about optimizations
- Get career advice
- Iterate until satisfied

## 📝 License

MIT

## 🙏 Acknowledgments

- Powered by [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- Uses [Llama 3.3 70B](https://www.llama.com/) from Meta
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

## 📧 Contact

Created for Cloudflare AI application assignment.

---

**Note**: This application uses Cloudflare's free tier. For production use, consider upgrading to handle higher traffic volumes.
