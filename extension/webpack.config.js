const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    "content-script": "./content-script.ts",
    "injection": "./injection.ts"
  },
  output: {
    path: path.resolve(__dirname, "../dist/orbit/extension/")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
}