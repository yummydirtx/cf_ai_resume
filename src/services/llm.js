/**
 * LLM service for Workers AI integration
 * Uses Llama 3.3 70B for resume optimization and chat
 */

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

/**
 * Optimize resume for a specific job listing
 */
export async function optimizeResume(resume, jobListing, additionalInfo, ai) {
    const systemPrompt = `You are an expert resume optimizer specializing in LaTeX formatting. Your task is to optimize resumes for specific job listings while maintaining LaTeX syntax.

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
- Keep content truthful and accurate`;

    const userPrompt = `Job Listing:
${jobListing.parsed || jobListing}

Current Resume (LaTeX):
${resume}

Additional Information:
${additionalInfo || 'None provided'}

Please optimize this LaTeX resume for the job listing above. Return ONLY the complete optimized LaTeX code.`;

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ];

    const response = await ai.run(MODEL, {
        messages,
        max_tokens: 4096,
        temperature: 0.7,
    });

    return response.response || response.result?.response || 'Error generating resume';
}

/**
 * Generate LLM response for chat refinement
 */
export async function generateLLMResponse(messages, resume, jobListing, additionalInfo, currentOptimizedResume, ai) {
    const systemPrompt = `You are an expert resume optimizer assistant. You help users refine their LaTeX resumes for specific job listings.

Context:
- Original Resume: Available
- Job Listing: ${jobListing?.parsed ? 'Parsed' : 'Available'}
- Current Optimized Resume: Available

Your role:
1. Answer questions about the optimization
2. Make requested changes to the LaTeX resume
3. Explain optimization decisions when asked
4. Provide career advice related to the job application
5. Always return updated LaTeX code when making changes

When the user requests changes, return the COMPLETE optimized LaTeX resume with modifications applied.
If the user is just asking a question, provide a helpful answer without returning code.`;

    const contextMessage = {
        role: 'system',
        content: `Context for this conversation:

Original Resume:
${resume}

Job Listing:
${jobListing.parsed || jobListing}

Additional Info:
${additionalInfo || 'None'}

Current Optimized Resume:
${currentOptimizedResume}`,
    };

    const fullMessages = [
        { role: 'system', content: systemPrompt },
        contextMessage,
        ...messages,
    ];

    const response = await ai.run(MODEL, {
        messages: fullMessages,
        max_tokens: 4096,
        temperature: 0.7,
    });

    return response.response || response.result?.response || 'Error generating response';
}
