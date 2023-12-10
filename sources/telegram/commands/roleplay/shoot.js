
module.exports.aliases = ["shoot"];

module.exports.execute = async (context) =>
{
    const requestUser = context.from.username;
    const responseUser = context.message.text.split(" ")[1];

    await context.reply(context.t("command-shoot", { requestUser: requestUser, responseUser: responseUser }));
}