
const grammy = require("grammy");
const express = require("express");

const os = require("node:os");
const fs = require("node:fs");

const path = require("node:path");

const processID = process.pid;

const client = new grammy.Bot(process.env.CLIENT_TOKEN || "");

const config = require("../config.json");

const commandsPath = path.join(__dirname, config.client.commands);
const queriesPath = path.join(__dirname, config.client.queries);

const commandsList = fs.readdirSync(commandsPath, { recursive: true });

for (let commandFile of commandsList)
{
    if(!commandFile.endsWith(".js"))
    {
        continue;
    }

    commandFile = commandFile.replace("\\", "/");
    console.log(`Found command ${commandFile}`);

    const commandFilePath = path.join(commandsPath, commandFile);

    try 
    {
        const commandModule = require(commandFilePath);
        client.command(commandModule.aliases, commandModule.execute);
    
        console.log(`Configured command /${commandModule.aliases[0]}`);
    } 
    catch (error) 
    {
        console.log(`Failed to configure command ${commandFile}`);
    }
}

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

if(process.env.NODE_ENV == "debug")
{
    client.start();
}