const path = require("path");

module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "www"),
    clean: true,
    assetModuleFilename: 'images/[name][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.handlebars$/, 
        loader: "handlebars-loader"
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'www'),
    },
    port: 8000,
    liveReload: true,
    historyApiFallback: true
  }
}