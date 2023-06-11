const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    },
  output: {
    path: path.join(__dirname, "/dist"), 
    filename: "bundle.js", 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html", 
    }),
  ],
  devServer: {
    port: 3030, 
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, 
        exclude: /node_modules/, 
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader",
        options: { limit: false },
      },
    ],
  },
};

module.exports = {
  mode: 'production',
  resolve: {
      extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
  },
output: {
  path: path.join(__dirname, "/build"), 
  filename: "bundle.js", 
},
plugins: [
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  })
],
module: {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/, 
      exclude: /node_modules/, 
      use: {
        loader: "babel-loader",
      },
    },
    {
      test: /\.(sa|sc|c)ss$/, 
      use: ["style-loader", "css-loader", "sass-loader"],
    },
    {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: "url-loader",
      options: { limit: false },
    },
  ],
},
};