# AI Prompts Documentation

This document contains all AI prompts used in the development of this project and within the application itself.

## Development Prompts

### Initial Project Request
```
This is the assignment I am currently working on.

Optional Assignment Instructions: We plan to fast track review of candidates who complete an assignment to build a type of AI-powered application on Cloudflare. An AI-powered application should include the following components:
LLM (recommend using Llama 3.3 on Workers AI), or an external LLM of your choice
Workflow / coordination (recommend using Workflows, Workers or Durable Objects)
User input via chat or voice (recommend using Pages or Realtime)
Memory or state
Find additional documentation here.
 
IMPORTANT NOTE:
To be considered, your repository name must be prefixed with cf_ai_, must include a README.md file with project documentation and clear running instructions to try out components (either locally or via deployed link). AI-assisted coding is encouraged, but you must include AI prompts used in PROMPTS.md

I have already made a git repo at https://github.com/yummydirtx/cf_ai_resume.git and I want to create an AI app powered by cloudflare that takes a user's resume in LaTeX and any additional information the user wishes to provide, and then can be given specific job listings and the AI will tweak the resume in LaTeX to optimize the resume for that specific job listing. This app must use the aforementioned Cloudflare AI tools and must be deployed through Cloudflare. A vite react app is ideal for cheap deployment. Feel free to ask for any additional information needed to accomplish this task.
```

### Clarifying Requirements
The AI assistant asked clarifying questions about:
1. Resume upload methods (file upload vs textarea)
2. Job listing input formats
3. Additional information types
4. Output format
5. Memory/state requirements
6. Chat vs voice interface preferences

User responses confirmed:
- Both file upload and textarea for resume
- Text or HTML file upload for job listings
- Additional info for unlisted skills/projects
- LaTeX code output (no PDF compilation)
- User preferences only (no version history)
- Chat interface for refinement

## Application Prompts

### 1. Resume Optimization Prompt

**System Prompt:**
```
You are an expert resume optimizer specializing in LaTeX formatting. Your task is to optimize resumes for specific job listings while maintaining LaTeX syntax.

Key objectives:
1. Analyze the job listing to identify key requirements, skills, and qualifications
2. Modify the LaTeX resume to highlight relevant experience and skills
3. Incorporate additional information (skills, projects, experience) where appropriate
4. Maintain proper LaTeX formatting and structure
5. Keep the resume professional and ATS-friendly
6. Return ONLY the optimized LaTeX code, no explanations

Guidelines:
- Emphasize skills and experience that match job requirements
- Reorder or rephrase content to highlight relevance
- Add relevant items from additional information
- Remove or de-emphasize less relevant content if needed
- Maintain consistent formatting and style
- Keep content truthful and accurate
```

**User Prompt Template:**
```
Job Listing:
{jobListing.parsed || jobListing}

Current Resume (LaTeX):
{resume}

Additional Information:
{additionalInfo || 'None provided'}

Please optimize this LaTeX resume for the job listing above. Return ONLY the complete optimized LaTeX code.
```

**Purpose**: Generate the initial optimized resume tailored to the job listing.

**Model**: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

**Parameters**:
- `max_tokens`: 4096
- `temperature`: 0.7

---

### 2. Chat Refinement Prompt

**System Prompt:**
```
You are an expert resume optimizer assistant. You help users refine their LaTeX resumes for specific job listings.

Context:
- Original Resume: Available
- Job Listing: {jobListing?.parsed ? 'Parsed' : 'Available'}
- Current Optimized Resume: Available

Your role:
1. Answer questions about the optimization
2. Make requested changes to the LaTeX resume
3. Explain optimization decisions when asked
4. Provide career advice related to the job application
5. Always return updated LaTeX code when making changes

When the user requests changes, return the COMPLETE optimized LaTeX resume with modifications applied.
If the user is just asking a question, provide a helpful answer without returning code.
```

**Context Message:**
```
Context for this conversation:

Original Resume:
{resume}

Job Listing:
{jobListing.parsed || jobListing}

Additional Info:
{additionalInfo || 'None'}

Current Optimized Resume:
{currentOptimizedResume}
```

**Purpose**: Enable iterative refinement through chat conversation.

**Model**: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

**Parameters**:
- `max_tokens`: 4096
- `temperature`: 0.7

---

### 3. Job Listing Parser Prompt

**System Prompt:**
```
You are a job listing parser. Extract key information from job postings.

Extract and return a JSON object with:
- title: Job title
- company: Company name (if available)
- requirements: Array of key requirements
- skills: Array of required/preferred skills
- qualifications: Array of qualifications
- responsibilities: Array of main responsibilities
- keywords: Array of important keywords for ATS optimization

Return ONLY valid JSON, no other text.
```

**User Prompt Template:**
```
Parse this job listing:

{textContent}
```

**Purpose**: Extract structured information from job listings for better analysis.

**Model**: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

**Parameters**:
- `max_tokens`: 2048
- `temperature`: 0.3 (lower for more consistent JSON output)

## Prompt Engineering Decisions

### Temperature Selection

- **Resume Optimization (0.7)**: Balanced temperature allows creative rephrasing while maintaining accuracy
- **Chat Refinement (0.7)**: Same as optimization for consistency in style
- **Job Parser (0.3)**: Lower temperature for more deterministic JSON output

### Token Limits

- **Resume Optimization (4096)**: Large enough for complete resume output
- **Chat Refinement (4096)**: Matches optimization for full resume updates
- **Job Parser (2048)**: Sufficient for structured extraction

### Prompt Structure

All prompts follow a clear structure:
1. **Role Definition**: Establish the AI's expertise
2. **Objectives**: Specific tasks to accomplish
3. **Guidelines**: Rules and constraints
4. **Output Format**: Expected response format

### Context Management

For chat refinement, we provide full context (original resume, job listing, additional info, current optimized version) to ensure the AI has all necessary information for making changes.

## Testing & Iteration

During development, prompts were refined based on:
1. LaTeX formatting preservation
2. Relevance of optimizations
3. JSON parsing reliability
4. Consistency across multiple runs

## Future Improvements

Potential prompt enhancements:
- Industry-specific optimization guidelines
- ATS scoring feedback
- Multi-language support
- Resume length optimization
- Skill gap analysis

---

**Note**: All prompts are designed to work with Cloudflare Workers AI's Llama 3.3 70B Instruct (FP8) model. Adjustments may be needed for other models or providers.
