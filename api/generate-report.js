// Filename: /api/generate-report.js
// ** PRODUCTION VERSION **

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const userData = req.body;

    // Updated validation to check for a required field from our new survey
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
      model: "gpt-4o", // Upgrading to a more powerful model for better calculations
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

// --- THIS IS THE NEW "MASTER PROMPT" ---
function buildProductionPrompt(userData) {
  return `
    **Role:** You are an expert UK financial analyst AI, adhering to the financial regulations and tax laws as of the 2024/2025 tax year. Your task is to create a detailed, multi-part financial report based on the provided user data.

    **Format:** Analyze the 'User Data' and generate a report as a single, valid JSON object. The root of the object must contain the following keys: 'profileSummary', 'quantitativeAnalysis', 'qualitativeAnalysis', 'financialMindset', 'financialProtection', 'swotAnalysis', and 'actionPlan'.

    **CRITICAL CALCULATION INSTRUCTIONS (Perform these first):**
    1.  **Gross Annual Household Income:** Sum 'yourSalary', 'partnerSalary' (if it exists and is numeric), ('otherIncome' * 12), and ('benefitsIncome' * 12).
    2.  **Total Annual Expenses:** Sum ('essentialExpenses' * 12) and ('discretionaryExpenses' * 12), and 'annualExpenses'.
    3.  **UK Tax Calculation:** Based on the 'Gross Annual Household Income' and the user's 'location', calculate the estimated 'incomeTax' and 'nationalInsurance' for the year.
    4.  **Net Annual Income:** Gross Annual Household Income - incomeTax - nationalInsurance.
    5.  **Net Monthly Income:** Net Annual Income / 12.
    6.  **Total Monthly Expenses:** Total Annual Expenses / 12.
    7.  **Monthly Surplus:** Net Monthly Income - Total Monthly Expenses.
    8.  **Total Assets:** Sum 'cashSavings', 'pensionValue', 'propertyValue', and 'otherInvestments'.
    9.  **Total Liabilities:** Sum 'mortgageBalance', 'creditCardDebt', and 'otherLoans'.
    10. **Net Worth:** Total Assets - Total Liabilities.
    11. **Savings Rate (%):** (Monthly Surplus / Net Monthly Income) * 100. Round to one decimal place.
    12. **Emergency Fund Coverage (Months):** cashSavings / essentialExpenses. Round to one decimal place.

    **JSON OUTPUT STRUCTURE (Adhere strictly to this):**

    1.  **'profileSummary':** An object containing: 'blueprintFor', 'location', 'age', 'profession', and a generated 'userCode' (e.g., "CMMFB" + 6 random digits).
    
    2.  **'quantitativeAnalysis':** An object containing:
        *   'netWorthSummary': An object with 'netWorth', 'totalAssets', 'totalLiabilities'.
        *   'annualTax': An object with 'incomeTax', 'nationalInsurance', and 'totalTax' (sum of the two).
        *   'incomeAndCashFlow': An object with 'grossAnnualIncome', 'netMonthlyIncome', 'monthlyExpenses', 'monthlySurplus', and a 'spendingBreakdown' object containing percentages for 'essential', 'discretionary', and 'savings' relative to Net Monthly Income.
    
    3.  **'qualitativeAnalysis':** An object containing any qualitative data provided by the user (e.g., 'careerStability'). For now, this can be an empty object.
    
    4.  **'financialMindset':** An object containing a 'profile' (e.g., "Balanced Saver") and two arrays of strings: 'strengths' and 'areasToDevelop'.
    
    5.  **'financialProtection':** An object containing:
        *   'emergencyFund': An object with 'currentBalance' (cashSavings), 'targetBalance' (essentialExpenses * 6), and 'coverageInMonths'.
        *   'insurance': An object mapping 'hasLifeInsurance', 'hasIncomeProtection' to boolean true/false.
        *   'estatePlanning': An object mapping 'hasWill', 'hasLPA' to boolean true/false.

    6.  **'swotAnalysis':** An object with four arrays of strings ('strengths', 'weaknesses', 'opportunities', 'threats'). Each array must contain at least 4 specific, insightful points derived from ALL calculated data.

    7.  **'actionPlan':** An array of 5-7 action item objects. Each object must have 'priority' ('High', 'Medium', 'Low'), a clear 'action' title, and a brief 'explanation'. Actions MUST be directly relevant to the user's biggest weaknesses and opportunities (e.g., if 'hasWill' is 'no', a high-priority action is to "Create a Will").

    **User Data:**
    ${JSON.stringify(userData, null, 2)}
  `;
}
