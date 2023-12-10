
module.exports.aliases = ["siberia"];

module.exports.execute = async (context) =>
{
    try
    {
        const requestUserFirstName = context.from.first_name || "";
        const requestUserLastName = context.from.last_name || "";

        const requestUser = `${requestUserFirstName} ${requestUserLastName}`.trim();

        const requestUserID = context.from.id;

        const responseUserFirstName = context.message.reply_to_message.from.first_name || "";
        const responseUserLastName = context.message.reply_to_message.from.last_name || "";

        const responseUser = `${responseUserFirstName} ${responseUserLastName}`.trim();

        const responseUserID = context.message.reply_to_message.from.id;
        
        await context.reply(`[${requestUser}](tg://user?id=${requestUserID}) сослал в Сибирь [${responseUser}](tg://user?id=${responseUserID})`, {parse_mode: "Markdown"});
    }
    catch(error)
    {
        console.error(error);

        await context.reply("Теперь в Сибирь отправляешься ты! 👻👻👻");
    }
};