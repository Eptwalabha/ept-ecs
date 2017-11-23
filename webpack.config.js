var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        "ept-ecs": [path.resolve(__dirname, "src/index.ts")],
        "ept-ecs.min": [path.resolve(__dirname, "src/index.ts")]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "ECS",
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    devtool: "source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            include: /\.min\.js$/
        })
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{ loader: "ts-loader" }]
        }]
    }
};
