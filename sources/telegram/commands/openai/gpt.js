
const openai = require("openai");

module.exports.execute = async (context) =>
{
    const userConfig = new openai.OpenAI
    ({
        apiKey: process.env.OPENAI_API_TOKEN,
        baseURL: process.env.OPENAI_API_URL
    });

    const userPrompt = context.message.text.slice(5);
    console.log(`User prompt: ${userPrompt}`);

    const chatCompletion = await userConfig.chat.completions.create
    ({
        model: "gpt-3.5-turbo",
        messages: 
        [{
            role: "user",
            content: userPrompt
        }]
    });

    await context.reply(chatCompletion.choices[0].message.content);
};