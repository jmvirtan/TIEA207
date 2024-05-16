const corsAnywhere = require("cors-anywhere");

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3001;

corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
    console.log(`Running CORS Anywhere on ${host}:${port}`);
});
