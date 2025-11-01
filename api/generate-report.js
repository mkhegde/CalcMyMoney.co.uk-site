// Filename: /api/generate-report.js
// ** PRODUCTION VERSION **

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const userData = req.body;

    // --- UPDATED VALIDATION ---
    // We now check for 'yourSalary' which is a required field in our new form.
    if (!userData || !userData.yourSalary) {
      return res.status(400).json({ error: 'Incomplete user data provided. Salary is required.' });
    }

    const prompt = buildProductionPrompt(userData);
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

// --- THIS IS THE NEW, SOPHISTICATED PROMPT ---
function buildProductionPrompt(userData) {
  return `
    **Role:** You are an expert UK financial analyst AI. Create a comprehensive, personalized financial health report based on the provided user data.

    **Format:** Analyze the following 'User Data' and generate a detailed financial report. The output MUST be a single, valid JSON object with the keys: 'profileSummary', 'quantitativeAnalysis', 'swotAnalysis', and 'actionPlan'.

    **Core Calculation Instructions (Perform these first):**
    1.  **Calculate Gross Household Income:** Sum 'yourSalary', 'partnerSalary' (if it exists), ('otherIncome' * 12), and ('benefitsIncome' * 12).
    2.  **Calculate Total Monthly Expenses:** Sum 'essentialExpenses', 'discretionaryExpenses', and ('annualExpenses' / 12).
    3.  **Calculate Total Assets:** Sum 'cashSavings', 'pensionValue', 'propertyValue', and 'otherInvestments'. Ignore any non-numeric or empty values.
    4.  **Calculate Total Liabilities:** Sum 'mortgageBalance', 'creditCardDebt', and 'otherLoans'. Ignore any non-numeric or empty values.
    5.  **Calculate Net Worth:** This is Total Assets - Total Liabilities.

    **JSON Output Structure:**

    1.  **'profileSummary':** Create an object containing:
        *   'blueprintFor': The user's choice (e.g., "Individual" or "Family").
        *   'location': The user's country (e.g., "England").
        *   'age': The user's age.
        *   'profession': The user's profession.
        *   'userCode': Generate a random user code like "CMMFB" followed by 6 random digits.

    2.  **'quantitativeAnalysis':** Create an object containing the results of the Core Calculations:
        *   'netWorth': The calculated Net Worth.
        *   'totalAssets': The calculated Total Assets.
        *   'totalLiabilities': The calculated Total Liabilities.
        *   (Also include any other relevant metrics you can derive).

    3.  **'swotAnalysis':** Create an object with four arrays ('strengths', 'weaknesses', 'opportunities', 'threats'). Each array should contain at least four distinct, insightful string points based on ALL the user's data (income, assets, debt, age, protection status, etc.). Make the analysis specific (e.g., mention the calculated Net Worth or savings rate).

    4.  **'actionPlan':** Create an array of 5-7 action item objects. Each object must have 'priority' ('High', 'Medium', or 'Low'), a clear 'action' title, and a brief 'explanation'. Base these actions on the user's biggest weaknesses and opportunities identified in the SWOT analysis. For example, if 'hasWill' is 'no', a high-priority action should be "Create a Will".

    **User Data:**
    ${JSON.stringify(userData, null, 2)}
  `;
}
