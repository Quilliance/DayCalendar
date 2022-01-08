const {merge} = require('webpack-merge');
const common = require('./webpack.common');

/** the development configurations
 *
 * The development server is run by Gulp.
 */
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map'
});
