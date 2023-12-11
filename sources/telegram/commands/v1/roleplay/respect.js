
const grammy = require("grammy");

const path = require("node:path");

module.exports.aliases = [ "honor", "respect" ];

module.exports.execute = async (context) =>
{
    try
    {
        const responseUserFirstName = context.message.reply_to_message.from.first_name || "";
        const responseUserLastName = context.message.reply_to_message.from.last_name || "";

        const responseUser = `${responseUserFirstName} ${responseUserLastName}`.trim();

        const responseUserID = context.message.reply_to_message.from.id;

        await context.reply("Почет и уважение! 👍👍👍");
        await context.replyWithSticker("https://cdn.discordapp.com/attachments/1183870991064121495/1183871116893237488/respect.webp?ex=6589e8e5&is=657773e5&hm=24a8ccd772f92de7b8a99184b74739b1d519c11615cd186913b8dc84f0382734&");
    }
    catch(error)
    {
        console.error(error);

        await context.reply("Ребятки, расходимся, почет и уважение отменяется. 💔")
    }
};