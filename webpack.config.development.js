const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { outputConfig, copyPluginPatterns, entryConfig, devServer } = require("./env.config");

module.exports = (env, options) => {
    return {
        mode: options.mode,
        entry: entryConfig,
        devServer,
        // Dev only
        // Target must be set to web for hmr to work with .browserlist
        // https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
        target: "web",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: { extensions: [".tsx", ".ts", ".js"] },
        output: {
            filename: "js/[name].bundle.js",
            path: path.resolve(__dirname, outputConfig.destPath),
            publicPath: "",
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./example/index.html",
                inject: true,
                minify: false
            }),
            new CopyPlugin(copyPluginPatterns),
        ]
    };
};