const WriteFilePlugin = require("write-file-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
        },
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: "url-loader",
      },
      {
        test: /\.(css|less)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(pdf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        loader: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: "../../gdaypunchbackend/static/[hash].worker.js",
    publicPath: `/static/`,
  },
  context: path.resolve(__dirname, "./"),
  resolve: {
    modules: [path.resolve(__dirname, "./"), "node_modules"],
    extensions: [".js", ".jsx", ".scss"],
    alias: {
      pages: path.resolve(__dirname, "src/pages/"),
      components: path.resolve(__dirname, "src/components/"),
      actions: path.resolve(__dirname, "src/actions/"),
      sagas: path.resolve(__dirname, "src/sagas/"),
      selectors: path.resolve(__dirname, "src/selectors/"),
      reducers: path.resolve(__dirname, "src/reducers/"),
      utils: path.resolve(__dirname, "src/utils/"),
      static: path.resolve(__dirname, "public/static/"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
      chunkFilename: "main.css",
    }),
    new WriteFilePlugin({
      // exclude hot-update files
      test: /^(?!.*(hot)).*/,
    }),
  ],
};
