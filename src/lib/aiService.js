import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = (apiKey) => {
    if (!apiKey) throw new Error("API Key is missing");
    return new GoogleGenerativeAI(apiKey);
};

export const testApiKey = async (apiKey) => {
    try {
        const genAI = getGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        return response.text().length > 0;
    } catch (error) {
        console.error("API Key Validation Error:", error);
        return false;
    }
};

export const generateSwotAnalysis = async (apiKey, ourAnalysis, competitors) => {
    try {
        const genAI = getGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Role: You are an expert educational consultant for private academies (Hagwon) in Korea.
        Task: Analyze the following SWOT data for a client's English academy and provide a strategic summary.
        
        [Client Academy Info]
        Strength: ${ourAnalysis?.strength || 'Not specified'}
        Weakness: ${ourAnalysis?.weakness || 'Not specified'}

        [Competitor Info]
        ${competitors?.map(c => `- Name: ${c.name}, Strength: ${c.strength}, Weakness: ${c.weakness}`).join('\n') || 'None'}

        Output Requirements:
        - Format: Markdown
        - Tone: Professional, encouraging, and strategic.
        - Language: Korean (Polite, '하십시오' style).
        - Structure:
          1. 📌 **핵심 승부수 (SO 전략)**: How to use strengths to dominate opportunities.
          2. 🎯 **기회 포착**: Targeting competitor weaknesses.
          3. 🛡 **위협 대응**: Defending against competitor strengths.
          4. ✨ **최종 제언**: A concluding warm advice.
        
        CRITICAL: For every strategy or advice, provide a "Concrete Action Plan" (What to do specifically). 
        Instead of just saying "Attack the weakness", say "Host a seminar on [Topic] to address [Weakness]".
        
        Keep it concise but impactful. Focus on "Business Viability" and "Marketing Actions".
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("SWOT Generation Error:", error);
        throw error;
    }
};

export const generateMarketingStrategy = async (apiKey, month, location, parentsType) => {
    try {
        const genAI = getGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Role: Senior Marketing Director for English Education.
        Task: Suggest 3 specific marketing actions for the month of ${month}월.
        Context:
        - Location: ${location} (Consider local characteristics if known, generic if not)
        - Target Parents: ${parentsType} (Educational zeal, income level, concerns)

        Output Requirements:
        - Format: JSON Array of objects with keys: "type" (one of: '설명회', '학교앞', '아파트'), "title", "desc".
        - Content:
          - '설명회': Seminar topic suitable for the season.
          - '학교앞': Outreach action near schools.
          - '아파트': Branding action within apartment complexes.
        - Language: Korean.
        - Example JSON:
        [
          {"type": "설명회", "title": "...", "desc": "..."},
          {"type": "학교앞", "title": "...", "desc": "..."},
          ...
        ]
        ONLY return the JSON string, no other text.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Simple cleanup to ensure JSON parsing if AI adds backticks
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Marketing Generation Error:", error);
        // Fallback or rethrow
        throw error;
    }
};

export const generateBudgetFeedback = async (apiKey, budgetData, financialGoals) => {
    try {
        const genAI = getGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Role: Financial Advisor for Small Businesses.
        Task: Review the monthly marketing budget allocation and predict ROI.
        
        [Budget Data]
        - Flyers: ${budgetData.flyerCount} sheets
        - Manpower: ${budgetData.manpowerCount} people, ${budgetData.manpowerHours} hours
        - Apartment Board: ${budgetData.aptBoardCost} KRW
        - Gifts/Snacks: ${budgetData.giftCount} units
        - Tuition Fee: ${budgetData.tuitionFee} KRW
        
        Output Requirements:
        - Format: HTML snippets (paragraphs with bold tags).
        - Language: Korean.
        - Content:
           1. **Budget Efficiency**: specific comment on the mix. (e.g., "Is flyer count too high/low?")
           2. **ROI Prediction**: Optimistic but realistic projection.
           3. **Adjustment Tip**: One concrete advice to save money or increase effect.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Budget Feedback Error:", error);
        throw error;
    }
};

export const generateTotalReview = async (apiKey, metrics, narrativeContext) => {
    try {
        const genAI = getGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Role: Chief Strategy Officer.
        Task: Write a comprehensive executive summary for the academy owner.
        
        [Metrics]
        - Utilization Rate: ${metrics.utilizationRate}%
        - Instructor Load: ${metrics.ratio} students/teacher
        - Price Position: ${metrics.priceStat}
        
        [Context]
        - Target: ${narrativeContext.target}
        - Competitor: ${narrativeContext.competitorName} (Strength: ${narrativeContext.competitorStrength})
        
        Output Requirements:
        - Format: Markdown (Use headers, bullet points).
        - Tone: Highly professional, insightful, "Expensive Consultant" vibe.
        - Language: Korean.
        - Brand Name: Use "EiE 고려대학교 영어교육 프로그램" instead of generic names.
        - Structure:
          1. **Current Status Diagnosis**: Honest (brutal if needed) assessment of efficiency.
          2. **Strategic Pivot**: How to position against the competitor.
          3. **Action Call**: Immediate next steps with CONCRETE details (e.g., "Start a Referral Event", not just "Increase marketing").
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Total Review Error:", error);
        throw error;
    }
};
