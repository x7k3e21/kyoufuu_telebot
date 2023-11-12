
const openai = require("openai");

module.exports.execute = async (context) =>
{
    console.log(`Message content: ${context.message.text}`);

    const userCredentials = context.message.text.split(" ");

    const userConfig = new openai.OpenAI
    ({
        apiKey: userCredentials[1],
        baseURL: userCredentials[2]
    });

    console.log(`User credentials: ${userCredentials[1]} / ${userCredentials[2]}`);

    const promptBeginning = context.message.text.search("\'");
        
    const userPrompt = context.message.text.slice(promptBeginning).slice(0, -1);

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

    await context.reply(chatCompletion.choices[0].message);
};