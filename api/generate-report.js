// Filename: /api/generate-report.js
// ** FINAL VERSION: Switched to use the OpenAI API **

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const userData = req.body;

    if (!userData || !userData.grossAnnualIncome) {
      return res.status(400).json({ error: 'Incomplete user data provided.' });
    }

    const prompt = buildLLMPrompt(userData);
    // --- CHANGE 1: Using the new environment variable for the OpenAI key ---
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // --- CHANGE 2: The API endpoint is now OpenAI's chat completions URL ---
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    // --- CHANGE 3: The request body structure is specific to OpenAI ---
    const requestBody = {
      // Using gpt-3.5-turbo as it's fast, reliable, and cost-effective.
      model: "gpt-3.5-turbo", 
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      // This tells newer OpenAI models to guarantee the output is valid JSON
      response_format: { "type": "json_object" }, 
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // --- CHANGE 4: Authentication uses a "Bearer" token ---
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API Error Body:', errorBody);
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }

    const llmResult = await response.json();
    
    // --- CHANGE 5: The path to the response text is different for OpenAI ---
    const reportJsonText = llmResult.choices[0].message.content;
    const reportObject = JSON.parse(reportJsonText);

    return res.status(200).json(reportObject);

  } catch (error) {
    console.error('Error in generateReport handler:', error);
    return res.status(500).json({ error: 'Failed to generate financial report.' });
  }
}

function buildLLMPrompt(userData) {
  // This prompt works perfectly for OpenAI as well. No changes needed here.
  return `
    **Role:** You are an expert financial analyst AI. Your task is to create a comprehensive, personalized, and encouraging financial health report based on the user data provided.

    **Format:** Analyze the following JSON data and generate a detailed financial report. The output MUST be a single, valid JSON object with the following top-level keys: 'profileSummary', 'quantitativeAnalysis', 'swotAnalysis', and 'actionPlan'. Do not include any text, notes, or markdown backticks (\`\`\`) before or after the JSON object.

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
