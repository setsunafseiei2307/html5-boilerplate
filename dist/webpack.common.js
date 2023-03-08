const HtmlWebpackPlugin =  require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode : 'development',
  entry : './js/app.js',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img' },
        { from: 'css', to: 'css' },
        { from: 'icon.svg', to: 'icon.svg'},
        { from: 'favicon.ico', to: 'favicon.ico'},
        { from: 'tile-wide.png', to: 'tile-wide.png'},
        { from: 'robots.txt', to: 'robots.txt'},
        { from: 'icon.png', to: 'icon.png'},
        { from: '404.html', to: '404.html'},
        { from: 'site.webmanifest', to: 'site.webmanifest'},
        { from: 'tile.png', to: 'tile.png'}
      ],
    })
  ]
};