// Filename: /api/generateReport.js
// ** Updated specifically for Google's Gemini API **

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
    const apiKey = process.env.LLM_API_KEY; // Get key from Vercel Environment Variables

    if (!apiKey) {
      console.error('LLM_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // --- CHANGE 1: The API endpoint URL is now specific to Google AI ---
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

    // --- CHANGE 2: The request body structure is different for Gemini ---
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      // This tells Gemini to make sure its output is valid JSON
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // --- CHANGE 3: We use the new requestBody ---
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google AI API Error:', errorBody);
      throw new Error(`Google AI API request failed with status ${response.status}`);
    }

    const llmResult = await response.json();
    
    // --- CHANGE 4: The path to the content is different in Google's response ---
    // We get the JSON text, then parse it into a JavaScript object.
    const reportJsonText = llmResult.candidates[0].content.parts[0].text;
    const reportObject = JSON.parse(reportJsonText);

    // Send the structured report back to the React frontend.
    return res.status(200).json(reportObject);

  } catch (error) {
    console.error('Error in generateReport handler:', error);
    return res.status(500).json({ error: 'Failed to generate financial report.' });
  }
}

function buildLLMPrompt(userData) {
  return `
    **Role:** You are an expert financial analyst AI. Your task is to create a comprehensive, personalized, and encouraging financial health report based on the user data provided.

    **Format:** Analyze the following JSON data and generate a detailed financial report. The output MUST be a single, valid JSON object with the following top-level keys: 'profileSummary', 'quantitativeAnalysis', 'qualitativeAnalysis', 'swotAnalysis', 'financialProtection', and 'actionPlan'. Do not include any text, notes, or markdown backticks (\`\`\`) before or after the JSON object.

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
