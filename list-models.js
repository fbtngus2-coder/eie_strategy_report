// List available models for this API key
const apiKey = 'AIzaSyAzyeXhceAjOgqJdEewhNtq1A7vv2jk3N0';

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        console.log('Fetching available models...\n');

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('✅ Available models:');
            console.log('='.repeat(50));

            data.models.forEach(model => {
                console.log(`\n📦 ${model.name}`);
                console.log(`   Display Name: ${model.displayName}`);
                console.log(`   Description: ${model.description?.substring(0, 80) || 'N/A'}`);
                console.log(`   Supported: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            });

            console.log('\n' + '='.repeat(50));
            console.log(`\nTotal models: ${data.models.length}`);

            // Find models that support generateContent
            const contentGenModels = data.models.filter(m =>
                m.supportedGenerationMethods?.includes('generateContent')
            );

            console.log(`\nModels supporting generateContent: ${contentGenModels.length}`);
            if (contentGenModels.length > 0) {
                console.log('\n🎯 Recommended model names to use:');
                contentGenModels.slice(0, 3).forEach(m => {
                    // Extract just the model name without 'models/' prefix
                    const modelName = m.name.replace('models/', '');
                    console.log(`   - "${modelName}"`);
                });
            }
        } else {
            console.log('❌ Error:', data);
        }
    } catch (error) {
        console.error('❌ Fetch error:', error.message);
    }
}

listModels();
