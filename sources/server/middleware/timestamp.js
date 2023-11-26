
module.exports.middleware = (request, response, handler) =>
{
    const timestamp = new Date();

    console.log(`Request timestamp: ${timestamp.toUTCString()}`);

    handler();
};