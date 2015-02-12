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

    externals: {
        simpleDOM: 'simpleDOM'
    },

    module: {
        loaders: [
            //loader removes code for testing
            {
                test: /^.*$/,
                loader: "regexp",
                rules: [
                    {
                        //TODO: [dmitry.makhnev] modify this regexp
                        'for': /\/\*@defaultTesting.exports\*\/[\w\.=+\-<>,'"/%/\[\];:(){}\s]*\*@\/defaultTesting.exports\*\//g,
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