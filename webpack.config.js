"use strict";

let path = require("path"),
    webpack = require("webpack");

module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname,
        filename: "dist/chevron.js"
    },
    module: {
        loaders: [{
            loader: "babel-loader",
            test: path.join(__dirname, "src"),
            query: {
                presets: "es2015",
            },
        },/* {
            // I want to uglify with mangling only app files, not thirdparty libs
            test: path.join(__dirname, "src"),
            loader: "uglify"
        }*/]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: "source-map",
};
