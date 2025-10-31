// Filename: /api/generate-report.js
// ** FINAL FIX: Changed the model name to the universally available 'gemini-pro' **

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
    const apiKey = process.env.LLM_API_KEY;

    if (!apiKey) {
      console.error('LLM_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // --- THIS IS THE FIX ---
    // The 'gemini-1.5-pro-latest' model was causing a 404 error.
    // Switched to the standard 'gemini-pro' model which is available on all API keys.
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google AI API Error:', errorBody);
      throw new Error(`Google AI API request failed with status ${response.status}`);
    }

    const llmResult = await response.json();
    const reportJsonText = llmResult.candidates[0].content.parts[0].text;
    const reportObject = JSON.parse(reportJsonText);

    return res.status(200).json(reportObject);

  } catch (error) {
    console.error('Error in generateReport handler:', error);
    return res.status(500).json({ error: 'Failed to generate financial report.' });
  }
}

function buildLLMPrompt(userData) {
  // This prompt function does not need to be changed
  return `
    **Role:** You are an expert financial analyst AI...
    **Format:** Analyze the following JSON data and generate a detailed financial report...
    **Instructions:** ...
    **User Data:**
    ${JSON.stringify(userData, null, 2)}
  `;
}
