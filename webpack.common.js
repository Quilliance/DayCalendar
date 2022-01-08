const path = require('path');

module.exports = {
  entry: './src/main.tsx',
  output: {
    filename: 'DayCalendar.js',
    path: path.resolve(__dirname, 'public', 'js'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
};
