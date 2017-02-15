const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const DefinePlugin = require('webpack/lib/DefinePlugin');


module.exports = webpackMerge(commonConfig, {
  plugins: [

    new DefinePlugin({
      __BACKEND_URL__: JSON.stringify('http://localhost:7000/api'),
 //     __BACKEND_URL__: JSON.stringify('https://retohome.youpers.org/api'),
      __VERSION__: JSON.stringify('1.0.0.' + Date.now())
    })
  ]

});
