// const path = require("path")
// const webpack = require("webpack")
//
// module.exports = {
//     entry: './public/js/app.js',
//     output: {
//         filename: 'bundle.js',
//         path: path.join(__dirname, "./public/dist")
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.m?js$/,
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: ['@babel/preset-env']
//                     }
//                 }
//             }
//         ]
//     }
// }

import path from 'path';
import webpack from 'webpack';

export default {
    entry: './public/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './public/dist'),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    mode: 'development',
};
