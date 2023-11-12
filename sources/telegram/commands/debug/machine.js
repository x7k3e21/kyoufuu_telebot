
const os = require("node:os");

module.exports.execute = async (context) =>
{
    if(context.from.id == process.env.CLIENT_OWNER_ID)
    {
        const hostName = os.hostname();
        const hostArch = os.machine();
    
        const processID = process.pid;

        const freeMemory = Math.round(os.freemem() >> 20);
        const totalMemory = Math.round(os.totalmem() >> 20);

        const processStatus = `Process ID: ${processID}`;
        await context.reply(processStatus);

        const hostStatus = `Host address: ${hostName}\nHost arch: ${hostArch}`;
        await context.reply(hostStatus);

        const memoryStatus = `Free RAM: ${freeMemory}/${totalMemory}Mb`;
        await context.reply(memoryStatus);
    }
    else
    {
        await context.reply("Invalid request!");
    }
};