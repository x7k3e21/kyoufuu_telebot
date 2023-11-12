
const grammy = require("grammy");
const express = require("express");

const os = require("node:os");

const processID = process.pid;

const client = new grammy.Bot(process.env.CLIENT_TOKEN || "");

client.command("machine", require("./telegram/commands/debug/machine").execute);

if(process.env.NODE_ENV == "production")
{
    const application = express();

    application.use(express.json());
    application.use("/client/callback", grammy.webhookCallback(client, "express"));

    application.get("/debug", (request, response) =>
    {
        const hostName = os.hostname();
        const hostArch = os.machine();

        response.set("Content-Type", "text/html");
        response.send(`<div>Host name: ${hostName}</div><div>Host arch: ${hostArch}</div>`);
    });

    const server = application.listen(process.env.PORT || 3030, () =>
    {
        const serverAddress = server.address().address;
        const serverPort = server.address().port;
        
        console.log(`Client is working on ${serverAddress}:${serverPort}`);
    });
}