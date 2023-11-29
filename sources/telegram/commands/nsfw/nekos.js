
const http = require("node:http");

module.exports.aliases = ["nekos"];

module.exports.execute = async (context) =>
{
    const requestedTag = context.message.text.split(" ")[1];

    http.get(`http://api.nekos.fun:8080/api/${requestedTag}`, (result) =>
    {
        let responseDataChunks = [ ];

        result.on("data", (dataChunk) =>
        {
            responseDataChunks.push(dataChunk);
        });

        result.on("end", () =>
        {
            const responseDataBuffer = Buffer.concat(responseDataChunks);

            const responseData = JSON.parse(responseDataBuffer.toString());

            context.replyWithPhoto(responseData.image);
        });
    }).on("error", (error) =>
    {
        console.error(error);
    });
};