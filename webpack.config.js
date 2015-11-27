var path = require("path");
var webpack = require("webpack");
var bowerConfig = require("./bower");

module.exports = {

    entry: path.resolve(bowerConfig.main),

    output: {
        path: path.resolve(bowerConfig.dist),
        filename: 'simpleDOM.js',
        libraryTarget: 'umd',
        library: 'simpleDOM'
    },


    module: {
        loaders: [
            //loader removes code for testing
            {
                test: /^.*$/,
                loader: "annotation",
                annotations: [
                    {
                        'for': 'defaultTesting.exports',
                        'do': ''
                    }
                ]
            }
        ]
    },

    resolve: {
        root: [path.join(__dirname, "bower_components")]
    },

    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.optimize.UglifyJsPlugin()
    ]
};