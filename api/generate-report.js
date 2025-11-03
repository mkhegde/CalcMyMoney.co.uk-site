// Filename: /api/generate-report.js
// ** FINAL PRODUCTION VERSION: Pre-calculates metrics in JS for accuracy **

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const userData = req.body;

    if (!userData || !userData.yourSalary) {
      return res.status(400).json({ error: 'Incomplete user data provided. Salary is required.' });
    }

    // --- STEP 1: PERFORM CALCULATIONS IN JAVASCRIPT ---
    const parseNum = (val) => parseFloat(String(val).replace(/,/g, '')) || 0;

    const grossAnnualIncome =
      parseNum(userData.yourSalary) +
      parseNum(userData.partnerSalary) +
      parseNum(userData.otherIncome) * 12 +
      parseNum(userData.benefitsIncome) * 12;
    const totalAssets =
      parseNum(userData.cashSavings) +
      parseNum(userData.pensionValue) +
      parseNum(userData.propertyValue) +
      parseNum(userData.otherInvestments);
    const totalLiabilities =
      parseNum(userData.mortgageBalance) +
      parseNum(userData.creditCardDebt) +
      parseNum(userData.otherLoans);
    const netWorth = totalAssets - totalLiabilities;

    // Create an object with our reliable calculations
    const calculatedMetrics = {
      grossAnnualIncome,
      totalAssets,
      totalLiabilities,
      netWorth,
    };

    // --- STEP 2: SEND PRE-CALCULATED DATA TO THE AI ---
    const prompt = buildProductionPrompt(userData, calculatedMetrics);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const requestBody = {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
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

// --- THIS IS THE NEW, SIMPLER PROMPT ---
function buildProductionPrompt(userData, calculatedMetrics) {
  return `
    **Role:** You are an expert UK financial analyst AI. Your task is to create a detailed financial report.

    **Source Data:** You have been provided with two JSON objects: 'User Data' (the user's raw answers) and 'Calculated Metrics' (pre-calculated financial totals).

    **CRITICAL INSTRUCTION:** For all quantitative parts of the report, you MUST use the values from the 'Calculated Metrics' object. Do NOT perform your own calculations.

    **Format:** Generate a report as a single, valid JSON object with the keys: 'profileSummary', 'quantitativeAnalysis', 'swotAnalysis', and 'actionPlan'.

    **JSON Output Structure:**
    1.  **'profileSummary':** Create an object using the data from the 'User Data' object ('age', 'profession', etc.). Generate a random 'userCode' (e.g., "CMMFB" + 6 random digits).

    2.  **'quantitativeAnalysis':** Create an object. Populate 'netWorth', 'totalAssets', and 'totalLiabilities' using the corresponding values directly from the 'Calculated Metrics' object.

    3.  **'swotAnalysis':** Create an object with four arrays ('strengths', 'weaknesses', 'opportunities', 'threats'). Each array must contain at least four distinct, insightful string points. Your analysis MUST be based on BOTH the 'User Data' (e.g., age, profession, protection status) AND the 'Calculated Metrics' (e.g., high net worth, low income).

    4.  **'actionPlan':** Create an array of 5-7 action item objects ('priority', 'action', 'explanation'). Base these actions on the user's biggest weaknesses and opportunities identified in the SWOT analysis.

    **User Data:**
    ${JSON.stringify(userData, null, 2)}

    **Calculated Metrics:**
    ${JSON.stringify(calculatedMetrics, null, 2)}
  `;
}
