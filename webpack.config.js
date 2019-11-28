const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        // path: __dirname + "/dist",
        publicPath: ""
    },
    devServer: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:80/roadmap-api",
                changeOrigin: true
            }
        }
    }
};