
const grammy = require("grammy");
const express = require("express");

const os = require("node:os");

const processID = process.pid;

const client = new grammy.Bot(process.env.CLIENT_TOKEN || "");

client.command("start", (context) =>
{
    context.reply(`Hello, ${context.from.username}`);
});

client.command("machine", (context) =>
{
    const hostName = os.hostname();
    const hostArch = os.machine();

    context.reply(`Host name: ${hostName}\nHost arch: ${hostArch}`);
});

if(process.env.NODE_ENV == "production")
{
    const application = express();

    application.use(express.json());
    application.use(grammy.webhookCallback(client, "express"));

    const server = application.listen(process.env.PORT || 3030, () =>
    {
        const serverAddress = server.address().address;
        const serverPort = server.address().port;
        
        console.log(`Client is working on ${serverAddress}:${serverPort}`);
    });
}