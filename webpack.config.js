const path = require('path');
const webpack = require('webpack');

module.exports = {
  /**
   * node, development, production
   * Enables certain built-in optimizations
   */
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

if (process.env.NODE_ENV === 'development') {
  module.exports.mode = "development";
  module.exports.devtool = 'source-map';
  module.exports.output.pathinfo = true;
} else if (process.env.NODE_ENV === 'production') {
  module.exports.mode = "production";
} else {
  module.exports.mode = "none";
}