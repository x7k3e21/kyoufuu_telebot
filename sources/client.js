
const grammy = require("grammy");
const express = require("express");

const chat_members = require("@grammyjs/chat-members");

const os = require("node:os");
const fs = require("node:fs");

const path = require("node:path");

const processID = process.pid;

const client = new grammy.Bot(process.env.CLIENT_TOKEN || "");

const chatMembersAdapter = new grammy.MemorySessionStorage();
client.use(chat_members.chatMembers(chatMembersAdapter));

const config = require("../config.json");

const commandsPath = path.join(__dirname, config.client.commands);
const queriesPath = path.join(__dirname, config.client.queries);

const middlewarePath = path.join(__dirname, config.server.middleware);

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
    //const dynamodb = require("@cyclic.sh/dynamodb");
    //const database = dynamodb(process.env.CYCLIC_DB);

    const application = express();

    application.use(express.json());
    application.use("/client/callback", grammy.webhookCallback(client, "express"));

    application.use((error, request, response, handler) =>
    {
        console.log(JSON.stringify(request));
        console.error(error);

        handler();
    });
    
    const middlewareList = fs.readdirSync(middlewarePath, { recursive: true });

    for(let middlewareFile of middlewareList)
    {
        if(!middlewareFile.endsWith(".js"))
        {
            continue;
        }

        middlewareFile = middlewareFile.replace("\\", "/");
        console.log(`Linking middleware ${middlewareFile}`);

        const middlewareFilePath = path.join(middlewarePath, middlewareFile);
    
        try 
        {
            const middlewareModule = require(middlewareFilePath);
            application.use(middlewareModule.middleware);
        
            console.log(`Linked middleware ${middlewareFile}`);
        } 
        catch (error) 
        {
            console.log(`Failed to link middleware ${middlewareFile}`);
        }
    }

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