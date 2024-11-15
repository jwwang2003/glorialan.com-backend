const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "none", // Sets bundling mode to 'none' (no optimizations).
  target: "node",
  entry: {
    bundle: "./src/index.ts", // Entry point of the application.
  },
  target: "node", // Bundles code for Node.js environment.
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: "swc-loader"
        }
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // Resolves these file extensions.
  },
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
  ],
  output: {
    filename: "main.js", // Names output file after its entry point ('bundle.js').
    path: path.resolve(__dirname, "build"), // Output directory for the bundled files.
  },
  externals: {
    "express": "require('express')"
  }
};
