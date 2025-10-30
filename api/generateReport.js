// Filename: /api/generateReport.js

// This is a Vercel Serverless Function which acts as our backend.
export default async function handler(req, res) {
  // 1. We only want to handle POST requests.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 2. Get the user's questionnaire data from the request body.
    const userData = req.body;

    // --- Basic Validation (You can expand this later) ---
    if (!userData || !userData.grossAnnualIncome) {
      return res.status(400).json({ error: 'Incomplete user data provided.' });
    }

    // 3. Construct the detailed prompt to send to the LLM.
    const prompt = buildLLMPrompt(userData);

    // --- LLM API Call ---
    // IMPORTANT: Replace 'YOUR_LLM_API_ENDPOINT' with the actual API endpoint URL from your AI provider (e.g., Google AI, OpenAI).
    const llmApiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/MODEL_NAME:generateContent'; 
    const apiKey = process.env.LLM_API_KEY; // Securely get the API key from Vercel Environment Variables.

    if (!apiKey) {
      console.error('LLM_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const response = await fetch(llmApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: The Authorization header might be different. 
        // For OpenAI it's `Bearer ${apiKey}`. For Google AI, the key is part of the URL.
        'Authorization': `Bearer ${apiKey}`, 
      },
      body: JSON.stringify({
        // Note: The request body structure depends on the LLM provider.
        // This is a common structure.
        model: "name-of-the-model-to-use", // e.g., "gpt-4", "gemini-1.5-pro"
        messages: [{ role: "user", content: prompt }],
        // Ask the LLM to respond in JSON format for easier parsing.
        response_format: { "type": "json_object" }, 
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('LLM API Error:', errorBody);
      throw new Error(`LLM API request failed with status ${response.status}`);
    }

    const llmResult = await response.json();
    
    // 4. Extract the JSON content from the LLM's response.
    // The exact path might differ, e.g., llmResult.choices[0].message.content
    const reportJson = JSON.parse(llmResult.choices[0].message.content);

    // 5. Send the structured report back to the React frontend.
    return res.status(200).json(reportJson);

  } catch (error) {
    console.error('Error in generateReport handler:', error);
    return res.status(500).json({ error: 'Failed to generate financial report.' });
  }
}


/**
 * Takes the raw user data and builds the detailed prompt for the LLM.
 * @param {object} userData - The data from the questionnaire.
 * @returns {string} The complete prompt string.
 */
function buildLLMPrompt(userData) {
  // The prompt we designed earlier.
  return `
    **Role:** You are an expert financial analyst AI. Your task is to create a comprehensive, personalized, and encouraging financial health report based on the user data provided.

    **Format:** Analyze the following JSON data and generate a detailed financial report. The output MUST be a single, valid JSON object with the following top-level keys: 'profileSummary', 'quantitativeAnalysis', 'qualitativeAnalysis', 'swotAnalysis', 'financialProtection', and 'actionPlan'. Do not include any text or markdown formatting before or after the JSON object.

    **Instructions:**
    1.  **Calculate Key Metrics:** From the user data, calculate and include: Total Assets, Total Liabilities, Net Worth, Monthly Surplus, Savings Rate, Debt-to-Income (DTI) Ratio, and Emergency Fund Coverage in months.
    2.  **Generate SWOT Analysis:** Based on all provided data, create a Financial SWOT analysis with at least 4 points for each category (Strengths, Weaknesses, Opportunities, Threats).
    3.  **Analyze Financial Protection:** Assess the user's insurance and estate planning. Highlight any gaps and explain the associated risks.
    4.  **Create Action Plan:** Generate a prioritized list of 5-7 actionable steps. Each step must have a 'priority' (High, Medium, or Low), a clear 'action' title, a brief 'explanation', and a 'potentialSaving' value where applicable.
    5.  **Maintain Tone:** The tone should be professional, empowering, and supportive. Use phrases like "Consider...", "You could explore...".

    **User Data:**
    ${JSON.stringify(userData, null, 2)}
  `;
}
