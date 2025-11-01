// Filename: /api/generate-report.js
// ** FINAL FIX: Updated the prompt with more explicit calculation instructions for the AI. **

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

    // This function now contains the improved prompt
    const prompt = buildLLMPrompt(userData);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      response_format: { "type": "json_object" },
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    const reportJsonText = llmResult.choices[0].message.content;
    const reportObject = JSON.parse(reportJsonText);

    return res.status(200).json(reportObject);

  } catch (error) {
    console.error('Error in generateReport handler:', error);
    return res.status(500).json({ error: 'Failed to generate financial report.' });
  }
}

function buildLLMPrompt(userData) {
  // --- THIS IS THE CRITICAL UPDATE ---
  return `
    **Role:** You are an expert financial analyst AI. Your task is to create a comprehensive, personalized, and encouraging financial health report based on the user data provided.

    **Format:** Analyze the following JSON data and generate a detailed financial report. The output MUST be a single, valid JSON object with the specified top-level keys.

    **Instructions:**
    1.  **Calculate Key Metrics:** From the 'User Data' below, perform the following calculations and place the results in the 'quantitativeAnalysis' section:
        *   'totalAssets': Calculate this by summing all numerical values in the 'assets' object from the User Data.
        *   'totalLiabilities': Calculate this by summing all numerical values in the 'liabilities' object from the User Data.
        *   'netWorth': Calculate this as 'totalAssets' minus 'totalLiabilities'.
        *   (You may also calculate monthlySurplus, savingsRate, etc., if possible from the data).
    2.  **Duplicate for Profile:** Copy the calculated 'totalAssets', 'totalLiabilities', and 'netWorth' into the 'profileSummary' section as well.
    3.  **Generate SWOT Analysis:** Based on all provided data, create a Financial SWOT analysis with at least 4 points for each category (strengths, weaknesses, opportunities, threats).
    4.  **Create Action Plan:** Generate a prioritized list of 5-7 actionable steps. Each step must have a 'priority' (High, Medium, or Low), a clear 'action' title, and a brief 'explanation'.

    **User Data:**
    ${JSON.stringify(userData, null, 2)}
  `;
}
