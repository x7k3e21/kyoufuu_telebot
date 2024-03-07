
module.exports.name = "ping";
module.exports.aliases = [ "latency", "пинг" ];

module.exports.execute = async (context) => 
{
    await context.reply("Pong!");
};