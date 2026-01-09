import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyAzyeXhceAjOgqJdEewhNtq1A7vv2jk3N0';

console.log('Testing with v1 API endpoint instead of v1beta...\n');

const genAI = new GoogleGenerativeAI(apiKey);

async function testWithDifferentConfig() {
    const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`\n🔍 Testing: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
            });

            const result = await model.generateContent("안녕하세요");
            const response = await result.response;
            const text = response.text();

            console.log(`✅ SUCCESS with ${modelName}!`);
            console.log(`Response: ${text}`);

            return modelName;
        } catch (error) {
            console.log(`❌ Failed: ${modelName}`);
            console.log(`   Error: ${error.message.substring(0, 100)}`);

            // Print full error for debugging
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Response:`, await error.response.text().catch(() => 'N/A'));
            }
        }
    }

    console.log('\n⚠️  All models failed. This might indicate:');
    console.log('   1. The API key doesn\'t have Gemini API access enabled');
    console.log('   2. Regional restrictions on your account');
    console.log('   3. The API might need additional setup in Google Cloud Console');

    return null;
}

testWithDifferentConfig();
