import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = (apiKey) => {
    if (!apiKey) throw new Error("API Key is missing");
    return new GoogleGenerativeAI(apiKey);
};

export const testApiKey = async (apiKey) => {
    try {
        const genAI = getGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Role: You are an expert educational consultant for private academies (Hagwon) in Korea.
        Task: Analyze the following SWOT data for a client's English academy and provide a strategic summary.
        
        [Client Academy Info]
        Strength: ${ourAnalysis?.strength || 'Not specified'}
        Weakness: ${ourAnalysis?.weakness || 'Not specified'}

        [Competitor Info]
        ${competitors?.map(c => `- Name: ${c.name}, Strength: ${c.strength}, Weakness: ${c.weakness}`).join('\n') || 'None'}

        Output Requirements:
        - Format: Markdown (use headers and bullet points)
        - Tone: Professional, encouraging, and strategic.
        - Language: Korean (Polite, '하십시오' style).
        - Length: CONCISE - Maximum 4-5 bullet points per section
        - Structure:
          1. 📌 **핵심 승부수 (SO 전략)**: 2-3 bullet points
          2. 🎯 **기회 포착**: 2-3 bullet points with CONCRETE actions  
          3. 🛡 **위협 대응**: 2 bullet points
          4. ✨ **최종 제언**: 1-2 sentences only
        
        CRITICAL: 
        - Keep each bullet point to ONE sentence maximum
        - Focus on ACTIONABLE advice, not explanations
        - Use specific examples (e.g., "Host a seminar on [Topic]" not "improve marketing")
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Role: Senior Marketing Director for English Education.
        Task: Suggest 3 specific marketing actions for the month of ${month}월.
        Context:
        - Location: ${location} (Consider local characteristics if known, generic if not)
        - Target Parents: ${parentsType} (Educational zeal, income level, concerns)

        Output Requirements:
        - Format: JSON Array only (no markdown, no backticks)
        - Length: Exactly 3 items, one per type
        - Each item structure: {"type": "설명회|학교앞|아파트", "title": "...", "desc": "..."}
        - Title: Maximum 15 characters
        - Description: Maximum 40 characters (use concrete action verbs)
        - Language: Korean
        
        Example:
        [{"type": "설명회", "title": "신학기 학습법 특강", "desc": "3월 1주차, 학부모 30명 대상 오프라인 진행"},
         {"type": "학교앞", "title": "환영 선물 배포", "desc": "개학일 아침 7:30-8:30, 알림장 500부"},
         {"type": "아파트", "title": "게시판 광고 집행", "desc": "타겟 아파트 5곳, 2주간 노출"}]
        
        ONLY return valid JSON array, nothing else.
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        - Format: Plain text paragraphs (no headers)
        - Length: Maximum 150 characters total
        - Language: Korean
        - Content: 2-3 sentences with specific numbers and recommendations
        - Focus on:
           1. One efficiency comment (e.g., "전단지 수량 적정/과다")
           2. One ROI prediction (e.g., "예상 신규 유입 X명")
           3. One actionable tip (e.g., "Y 항목을 Z원으로 조정 권장")
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        - Format: Markdown (use ONE header and bullet points)
        - Length: Maximum 5 bullet points total
        - Tone: Highly professional, direct, "Executive Summary" style
        - Language: Korean
        - Brand Name: Use "EiE 고려대학교 영어교육 프로그램"
        - Structure:
          **전략 요약 (3-5 bullet points)**
          - 현재 상태 진단: 1 sentence
          - 경쟁 대응: 1 sentence with specific competitor name
          - 즉시 실행 과제: 1-2 concrete actions (e.g., "3월 1주 설명회 개최", "월 예산 15% 증액")
        
        Keep it under 200 characters total.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Total Review Error:", error);
        throw error;
    }
};
