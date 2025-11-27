/**
 * Parser service for job listings
 * Handles both text and HTML job postings
 */

/**
 * Parse job listing using LLM
 */
export async function parseJobListing(content, isHtml, ai) {
    let textContent = content;

    // If HTML, extract text content
    if (isHtml) {
        textContent = extractTextFromHTML(content);
    }

    // Use LLM to extract structured information
    const systemPrompt = `You are a job listing parser. Extract key information from job postings.

Extract and return a JSON object with:
- title: Job title
- company: Company name (if available)
- requirements: Array of key requirements
- skills: Array of required/preferred skills
- qualifications: Array of qualifications
- responsibilities: Array of main responsibilities
- keywords: Array of important keywords for ATS optimization

Return ONLY valid JSON, no other text.`;

    const userPrompt = `Parse this job listing:\n\n${textContent}`;

    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        max_tokens: 2048,
        temperature: 0.3,
    });

    const responseText = response.response || response.result?.response || '{}';

    try {
        // Try to parse JSON from response
        const parsed = JSON.parse(responseText);
        return {
            original: textContent,
            parsed: parsed,
        };
    } catch (error) {
        // If JSON parsing fails, return raw text
        return {
            original: textContent,
            parsed: responseText,
        };
    }
}

/**
 * Extract text from HTML
 */
function extractTextFromHTML(html) {
    // Simple HTML tag removal
    // In a production app, you might want to use a proper HTML parser
    let text = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return text;
}
