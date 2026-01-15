import { callOpenAI } from './src/lib/aiService.js';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_OPENAI_API_KEY;

async function testOpenAI() {
    console.log("Testing OpenAI API...");
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "user", content: "Hello, say 'OpenAI is working' if you see this." }
                ],
                max_tokens: 20
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }

        const data = await response.json();
        console.log("✅ Success!");
        console.log("Response:", data.choices[0].message.content);
    } catch (error) {
        console.error("❌ Failed:", error.message);
    }
}

testOpenAI();
