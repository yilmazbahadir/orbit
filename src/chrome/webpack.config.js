var path = require('path');

module.exports = {
  mode: "development",

  entry: {
    background: "./src/background.ts",
    content_script: "./src/content_script.ts",
    injection: "./src/injection.ts"
  },
  output: {
    path: path.join(__dirname, "lib"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts"]
  }
};