
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const callOpenAI = async (messages, model = "gpt-4o") => {
    try {
        if (!OPENAI_API_KEY) {
            throw new Error("OpenAI API Key is missing. Please check .env file.");
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

export const testApiKey = async () => {
    try {
        // Simple test to check if the key works
        const result = await callOpenAI([
            { role: "user", content: "Hello, are you working?" }
        ]);
        return result && result.length > 0;
    } catch (error) {
        console.error("API Key Validation Error:", error);
        return false;
    }
};

export const generateSwotAnalysis = async (apiKey, ourAnalysis, competitors) => {
    const prompt = `
    Role: You are a top-tier educational management consultant famous for turning around local academies in Korea.
    Task: Analyze the client's academy and competitors to provide a "Winning Strategy".

    [Client Academy Info]
    - Strengths: ${ourAnalysis?.strength || 'Not specified'}
    - Weaknesses: ${ourAnalysis?.weakness || 'Not specified'}

    [Competitors]
    ${competitors?.map(c => `- ${c.name}: Strength(${c.strength}), Weakness(${c.weakness})`).join('\n') || 'None'}

    Output Requirements:
    - Tone: Sharp, Insightful, and Action-Oriented (Professional Consultant).
    - Language: Korean (Formal '하십시오' style).
    - Format: Markdown with specific headers.

    Structure & Content Rules (EXTREMELY IMPORTANT):
    1. 📌 **핵심 승부수 (SO 전략)**
       - Do NOT say "Use your strengths". 
       - DO say: "Launch a '[Specific Program Name]' targeting [Specific Gap] to dominance over [Competitor Name]."
       - Provide 2 detailed actionable strategies.
    
    2. 🎯 **기회 포착 & 틈새 공략**
       - Analyze the competitor's weakness deeply.
       - Suggest a "Counter-Attack Marketing Message" or specific curriculum adjustment.
       - Provide 2 detailed points.

    3. 🛡 **위협 대응 & 리스크 관리**
       - How to defend against competitors' strengths?
       - Suggest a specific "Counseling Script" point to use when parents compare you with them.
    
    4. ✨ **원장님을 위한 한마디**
       - 1 sentence of powerful encouragement based on the analysis.

    CRITICAL: Avoid abstract advice like "reinforce marketing" or "improve quality". Be specific: "Create a 3-minute YouTube video about..."
    `;

    return await callOpenAI([
        { role: "system", content: "You are a sharp, no-nonsense business consultant." },
        { role: "user", content: prompt }
    ]);
};

export const generateMarketingStrategy = async (apiKey, month, location, parentsType) => {
    const prompt = `
    Role: Expert Marketing Director.
    Task: Create a monthly marketing calendar for an English Academy.
    Context: Month: ${month}월 / Location: ${location} / Parent Type: ${parentsType}
    
    Output Requirements:
    - Format: JSON Array ONLY.
    - Length: Exactly 3 items.
    - Language: Korean.

    Constraint:
    - ABSOLUTELY NO generic output like "Online Marketing" or "School Campaign".
    - BE SPECIFIC: 
       - blog_title: "Must be a catchy click-bait title" (e.g., "Moms in Dongtan are shocked by this...")
       - offline_action: "Specific item & location" (e.g., "Distribute 'Luminous Fans' at [School Name] main gate")

    JSON Structure:
    [
      {"type": "블로그/맘카페", "title": "[Specific Catchy Title]", "desc": "[Specific Content to write about]"},
      {"type": "오프라인/현장", "title": "[Specific Event Name]", "desc": "[Action Item & Location]"},
      {"type": "원내/재원생", "title": "[Specific Event Name]", "desc": "[Action for current students]"}
    ]
    `;

    const text = await callOpenAI([
        { role: "system", content: "You are a creative marketing genius. Return only JSON." },
        { role: "user", content: prompt }
    ]);

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
};

export const generateBudgetFeedback = async (apiKey, budgetData, financialGoals) => {
    const prompt = `
    Role: Financial Advisor for Small Businesses.
    Task: Review the monthly marketing budget allocation and predict ROI.
    
    [Budget Plan]
    - Flyers: ${budgetData.flyerCount} sheets
    - Manpower: ${budgetData.manpowerCount} people * ${budgetData.manpowerHours} hours
    - Apartment Board: ${budgetData.aptBoardCost} KRW
    - Gifts: ${budgetData.giftCount} units
    - Tuition Fee: ${budgetData.tuitionFee} KRW
    
    Output Requirements:
    - Format: Markdown (Concise).
    - Tone: Professional, Analytical.
    - Language: Korean.
    
    Content:
       1. One sentence summary of the budget balance (Is it too heavy on offline?).
       2. One ROI prediction (e.g., "예상 신규 유입 X명")
       3. One actionable tip (e.g., "Y 항목을 Z원으로 조정 권장")
    `;

    return await callOpenAI([
        { role: "system", content: "You are a helpful financial assistant." },
        { role: "user", content: prompt }
    ]);
};

export const generateTotalReview = async (apiKey, metrics, narrativeContext) => {
    const prompt = `
    Role: Senior Strategic Consultant (McKinsey/Bain style) for Education Business.
    Task: Synthesize all metrics and context to provide a "Killer Executive Summary".
    
    [Quantitative Analysis]
    - Utilization Rate: ${metrics.utilizationRate}% (Standard: 80~120%)
    - Instructor Efficiency: ${metrics.ratio} students per teacher (Standard: 10~15)
    - Price Positioning: ${metrics.priceStat}
    
    [Qualitative Context]
    - Target: ${narrativeContext.target}
    - Major Competitor: ${narrativeContext.competitorName} (Strength: ${narrativeContext.competitorStrength})
    - My Core Strength: ${narrativeContext.myStrength}
    
    Output Requirements:
    - Tone: Critical, Analytical, and Prescriptive. 
    - **Do NOT just repeat the numbers.** Explain what they MEAN together.
    
    Structure & Logic:
    
    1. **📊 경영 효율성 정밀 진단 (Synthesis)**
       - IF Utilization > 150%: "Explosive demand detected. IMMEDIATELY raise tuition by 10-15% or expand space. You are currently losing money by being too cheap."
       - IF Utilization < 60%: "Critical warning. Vacancy is high. Stop recruiting teachers and focus on 'Filling the class' via marketing."
       - Connect 'Instructor Efficiency' to 'Profitability'.
    
    2. **⚡ 경쟁 우위 확보 전략 (Winning Move)**
       - Compare [My Strength] vs [Competitor Strength].
       - If Competitor is "Native Speaker" and We are "Grammar", say: "Don't fight on Speaking. Position as 'The Academy that actually fixes Grades'. Attack their lack of test results."
    
    3. **✅ 이번 달 3대 우선순위 (Priorities)**
       - Provide 3 extremely specific tasks based on the diagnosis above. (e.g., "Raise fee to 380,000 KRW", "Fire bottom 10% students", "Hire 1 Admin", etc.)
    `;

    return await callOpenAI([
        { role: "system", content: "You are a cold, calculated business strategist." },
        { role: "user", content: prompt }
    ]);
};

export const generateStpStrategy = async (apiKey, ourAnalysis, competitors, studentInfo, parentsType, targetAudience) => {
    const prompt = `
    Role: Brand Identity Architect.
    Task: Construct a coherent STP narrative. Do NOT just list S-T-P. They must link logically.

    [Inputs]
    - My Strength: ${JSON.stringify(ourAnalysis?.strength)}
    - My Weakness: ${JSON.stringify(ourAnalysis?.weakness)}
    - Competitors: ${JSON.stringify(competitors?.map(c => c.name))}
    - Competitor Weaknesses: ${JSON.stringify(competitors?.map(c => c.weakness))}
    - User's Desired Target: ${targetAudience}

    Output Requirements (Korean):
    
    ### 1. SEGMENTATION & GAP ANALYSIS (시장의 틈새)
    - **Logic**: Look at [Competitor Weakness]. Where are they failing?
    - **Output**: "The market is currently underserved in [Specific Area] because [Competitor] is failing to provide [Service]. This is our entry point."

    ### 2. TARGETING RE-VALIDATION (타겟 재정의)
    - **Critical Check**: Does [User's Desired Target] actually match [My Strength]?
    - **Output**: 
      - If unique match: "Your choice of [Target] is perfect because you have [Strength]."
      - If mismatch: "Warning: You chose [Target], but your strength is [Strength]. I recommend pivoting to [Better Target] for higher ROI."
      - Define the Persona vividly (e.g., "Anxious moms in their 40s who gave up on 'Fun English'").

    ### 3. POSITIONING STATEMENT (차별화 선언)
    - **Formula**: "To [Target], [Academy Name] is the [Category] that provides [Benefit] unlike [Competitor]."
    - Create a powerful Brand Slogan based on this formula.
    `;

    return await callOpenAI([
        { role: "system", content: "You are a brand architect who creates cult brands." },
        { role: "user", content: prompt }
    ]);
};
