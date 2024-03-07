
const grammy = require("grammy");
const express = require("express");

const os = require("node:os");
const fs = require("node:fs");

const path = require("node:path");

const processID = process.pid;

const client = new grammy.Bot(process.env.CLIENT_TOKEN || "");

const clientConfig = require("../config.json");

const commandsPath = path.join(__dirname, clientConfig.client.paths.commandsPath);
const queriesPath = path.join(__dirname, clientConfig.client.paths.queriesPath);

const clientPrefix = clientConfig.client.commandsPrefix;

const commandsList = fs.readdirSync(commandsPath, { recursive: true });
const queriesList = fs.readdirSync(queriesPath, { recursive: true });

const commandsMap = new Map();

for(let commandFile of commandsList)
{
    if(!commandFile.endsWith(".js")) continue;

    commandFile = commandFile.replace("\\", "/");

    const commandPath = path.join(commandsPath, commandFile);

    try
    {
        const commandModule = require(commandPath);

        commandsMap.set(commandModule.name, commandModule.execute);

        for(let alias of commandModule.aliases)
        {
            commandsMap.set(alias, commandModule.execute);
        }

        console.log(`Successfully configured ${commandFile}`);
    }
    catch(error)
    {
        console.log(`Failed to configure command ${commandFile}`);
    }
}

client.on("message:text", async (context) =>
{
    const messageContent = context.message.text.split(" ");

    const commandName = messageContent[0];
    const commandArgs = messageContent.slice(1);

    let commandScript = undefined;

    if(commandName.startsWith(clientPrefix))
    {
        commandScript = commandsMap.get(commandName.slice(1));
    }
    else
    {
        commandScript = commandsMap.get(commandName);
    }

    if(commandScript != undefined)
    {
        commandScript(context);
    }
});

if(process.env.NODE_ENV == "production")
{
    const application = express();

    application.use(express.json());
    application.use("/client/callback", grammy.webhookCallback(client, "express"));

    application.set("view engine", "hbs");

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