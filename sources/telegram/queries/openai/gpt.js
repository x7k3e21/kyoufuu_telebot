
const openai = require("openai");
const grammy = require("grammy");

module.exports.query = async (context) =>
{
    const userConfig = new openai.OpenAI
    ({
        apiKey: process.env.OPENAI_API_TOKEN,
        baseURL: process.env.OPENAI_API_URL
    });

    const chatCompletion = await userConfig.chat.completions.create
    ({
        model: "gpt-3.5-turbo",
        messages: 
        [{
            role: "user",
            content: context.inlineQuery.query
        }]
    });

    const inlineQueryAnswer = grammy.InlineQueryResultBuilder
        .article("id-0", "GPT result").text(chatCompletion.choices[0].message.content);

    await context.answerInlineQuery([inlineQueryAnswer]);
};