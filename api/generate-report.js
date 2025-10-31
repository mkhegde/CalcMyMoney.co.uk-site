// Filename: /api/generate-report.js
// ** FINAL FIX: Changed API endpoint from v1beta to the stable v1 **

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
    // The Google API reported a 404 because gemini-pro is on the 'v1' endpoint, not 'v1beta'.
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

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
      console.error('Google AI API Error Body:', errorBody);
      throw new Error(`Google AI API request failed with status ${response.status}`);
    }

    const llmResult = await response.json();

    if (!llmResult.candidates || !llmResult.candidates[0] || !llmResult.candidates[0].content) {
      console.error('Unexpected response structure from Google AI:', llmResult);
      throw new Error('Invalid response structure from AI.');
    }

    const reportJsonText = llmResult.candidates[0].content.parts[0].text;
    const reportObject = JSON.parse(reportJsonText);

    return res.status(200).json(reportObject);

  } catch (error) {
    console.error('Error in generateReport handler:', error);
    return res.status(500).json({ error: 'Failed to generate financial report.' });
  }
}

function buildLLMPrompt(userData) {
  // This function is correct and does not need to change.
  // Using a truncated version for clarity.
  return `**Role:** You are an expert financial analyst AI... **User Data:** ${JSON.stringify(userData, null, 2)}`;
}
