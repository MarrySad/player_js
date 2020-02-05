const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, './src/script.js'),
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	mode: 'development',
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		historyApiFallback: true
	}
}