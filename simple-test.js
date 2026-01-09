import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyAzyeXhceAjOgqJdEewhNtq1A7vv2jk3N0';

console.log('Testing API Key:', apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

async function simpleTest() {
    try {
        console.log('\n🔍 Testing gemini-1.5-flash...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log('✅ SUCCESS!');
        console.log('Response:', response.text());
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('Full error:', JSON.stringify(error, null, 2));
    }
}

simpleTest();
