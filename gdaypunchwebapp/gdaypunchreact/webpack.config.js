module.exports = {
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(css|less)$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: "url-loader"
      }
    ]
  }
};
