// Copyright 2023 catgirl-jade
// 
// This file is part of nophicas-tidings.
// 
// nophicas-tidings is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
// 
// nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License along with nophicas-tidings. If not, see <https://www.gnu.org/licenses/>.

const CopyWebpackPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const path = require('path');

// Default to production mode
const MODE: string = "production";

// Rust settings depend on production/development
const RUST_FLAGS = function(): string {
  if (MODE == "development") {
    return "--features development"; 
  }
  else if (MODE == "production") {
    return "--features production";
  }
  else {
    throw new Error("Invalid Mode");
  }
}(); 

module.exports = {
  mode: MODE,
  // Context
  context: __dirname,
  // Entrypoint to the program
  entry: "./ts/index.ts",
  // Build output name 
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "docs"),
    clean: true
  },
  module: {
    rules: [
      // Typescript stuff
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // Bootstrap
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
    ],
  },
  resolve: {
    extensions: [
      ".webpack.js",
      ".ts",
      ".tsx",
      ".js"
    ],
  },
  devServer: {
    watchFiles: ["index.html"],
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
  }, 
   
  plugins: [
    // Bundles in index.html
    new CopyWebpackPlugin({
      patterns: [
        {from: "index.html", to: "index.html"}
      ]
    }),
    // Auto-build the wasm project
    new WasmPackPlugin({
      crateDirectory: __dirname,
      extraArgs: RUST_FLAGS,
    }),
  ],
 
  // For webassemply support 
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },
  performance: {
    hints: false
  },
};

if (MODE === "development") {
  module.exports.devtool = "source-map";
}
