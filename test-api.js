import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.argv[2];

if (!apiKey) {
    console.error('Usage: node test-api.js YOUR_API_KEY');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-pro',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro'
];

async function testModel(modelName) {
    try {
        console.log(`\nTesting: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello in Korean");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS: ${modelName}`);
        console.log(`Response: ${text.substring(0, 50)}...`);
        return modelName;
    } catch (error) {
        console.log(`❌ FAILED: ${modelName}`);
        console.log(`Error: ${error.message.substring(0, 100)}`);
        return null;
    }
}

async function main() {
    console.log('🔍 Testing which Gemini models work with your API key...\n');

    const workingModels = [];

    for (const modelName of modelsToTest) {
        const result = await testModel(modelName);
        if (result) {
            workingModels.push(result);
        }
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n\n📊 RESULTS:');
    console.log('='.repeat(50));
    if (workingModels.length > 0) {
        console.log('✅ Working models:');
        workingModels.forEach(m => console.log(`  - ${m}`));
    } else {
        console.log('❌ No models worked. Check your API key or account status.');
    }
}

main();
