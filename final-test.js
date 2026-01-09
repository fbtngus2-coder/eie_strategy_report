import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyAzyeXhceAjOgqJdEewhNtq1A7vv2jk3N0';

console.log('Testing with gemini-2.5-flash...\n');

const genAI = new GoogleGenerativeAI(apiKey);

async function finalTest() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent("안녕하세요! 간단한 인사말을 해주세요.");
        const response = await result.response;
        const text = response.text();

        console.log('✅ 완벽하게 작동합니다!');
        console.log('='.repeat(50));
        console.log('AI 응답:', text);
        console.log('='.repeat(50));
        console.log('\n🎉 이제 브라우저에서 API 키를 다시 입력하면 성공할 것입니다!');
    } catch (error) {
        console.log('❌ 여전히 에러:', error.message);
    }
}

finalTest();
