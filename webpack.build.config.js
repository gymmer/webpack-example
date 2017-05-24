var path = require('path');

// webpack 依赖
var webpack = require('webpack');

// webpack 插件
var HtmlWebpckPlugin = require('html-webpack-plugin');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');

// 获取绝对路径
var getAbsolutePath = function(file) {
	return path.resolve(__dirname, file);
}

module.exports = {

	// 入口文件
	entry: getAbsolutePath('src/entry.js'),

	// 打包输出路径
	output: {
		path: getAbsolutePath('build'),
		filename: 'js/[name]-[hash].js'
		
		// 使用CDN
		// publicPath: 'http://cdn.com/'
	},
	
	module: {
		loaders: [

			// 转换ES6
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['latest']
				},
				include: getAbsolutePath('src'),
	        	exclude: getAbsolutePath('node_modules')
			},

			// 处理json格式
			{
        		test: /\.json$/,
		        loader: 'json-loader',
	        	include: getAbsolutePath('src'),
	        	exclude: getAbsolutePath('node_modules')
	      	},

	      	// 添加对样式表的处理
			{
	        	test: /\.css$/,
		        loader: ExtractTextWebpackPlugin.extract({
		        	fallback: 'style-loader',
		        	use: 'css-loader'
	        	}),
	        	include: getAbsolutePath('src'),
	        	exclude: getAbsolutePath('node_modules')
	      	},

	      	// 编译Less
	      	{
	        	test: /\.less$/,
		        loader: ExtractTextWebpackPlugin.extract({
		        	fallback: 'style-loader',
		        	use: 'css-loader!less-loader'
	        	}),
	        	include: getAbsolutePath('src'),
	        	exclude: getAbsolutePath('node_modules')
	      	},

	      	// 编译Sass+Compass
	      	{
	        	test: /\.(scss|sass)$/,
		        loader: ExtractTextWebpackPlugin.extract({
		        	fallback: 'style-loader',
		        	use: 'css-loader!ruby-sass-loader?compass=1&outputStyle=compress'
	        	}),
	        	include: getAbsolutePath('src'),
	        	exclude: getAbsolutePath('node_modules')
	      	}

		]
	},

	plugins: [

		// 清除构建的目标路径
		new CleanWebpackPlugin(['build'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),

		// 构建HTML文件
		new HtmlWebpckPlugin({
			template: getAbsolutePath('src/index.html'),
			minify: {
				removeComments: true,
				collapseWhitespace: true
			}
		}),

		// 提取样式文件
		new ExtractTextWebpackPlugin({
		    filename: function (getPath) {
		    	return getPath('css/[name]-[hash].css').replace('css/js', 'css');
		    },
		    allChunks: true
		}),

		// 复制文件
		new CopyWebpackPlugin([
			{
				from: getAbsolutePath('src/img'),
				to: 'img'
			},
			{
				from: getAbsolutePath('src/fonts'),
				to: 'fonts'
			}
		]),

		// 压缩JS文件
	    new webpack.optimize.UglifyJsPlugin(),

		// 版权声明
		new webpack.BannerPlugin("Copyright Alibaba inc.")

	]
}