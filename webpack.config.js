var webpack = require('webpack');
var path = require('path');
var devServer = require('webpack-dev-server');
var HtmlWebpckPlugin = require('html-webpack-plugin');
//css样式从js文件中分离出来
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

var CleanWebpackPlugin = require('clean-webpack-plugin');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var getAbsolutePath = function(file) {
	return path.resolve(__dirname, file);
}

module.exports = {

	// 入口文件
	entry: getAbsolutePath('src/entry.js'),

	// 打包输出路径
	output: {
		path: getAbsolutePath('dist'),
		filename: 'js/[name].js'

		// 解决缓存
		// filename: 'js/[name]-[hash].js'
		
		// 使用CDN
		// publicPath: 'http://cdn.com/'
	},

	// 使用Source Map
	// devtool: 'source-map',//配置生成Source Maps，选择合适的选项
	// devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
	
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
		        // loader: 'style-loader!css-loader'
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
	        	// loader: 'style-loader!css-loader!less-loader'
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
	        	// loader: 'style-loader!css-loader!sass-loader'
		        // loader: "style-loader!css-loader!sass-loader?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib")
		        // loader: 'style-loader!css-loader!ruby-sass-loader?compass=1'
		        loader: ExtractTextWebpackPlugin.extract({
		        	fallback: 'style-loader',
		        	//use: 'css-loader!sass-loader?outputStyle=expanded'
		        	// use: 'style-loader!css-loader!sass-loader?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
		        	use: 'css-loader!ruby-sass-loader?compass=1&outputStyle=expanded'
	        	}),
	        	include: getAbsolutePath('src'),
	        	exclude: getAbsolutePath('node_modules')
	      	}

		]
	},

	// 启动本地服务器:  
	// （1）node_modules/.bin/webpack-dev-server
	// （2）npm run server
	devServer: {
	    contentBase: getAbsolutePath('dist'),	// 根目录
	    // colors: true,//终端中输出结果为彩色
	    // historyApiFallback: true,//不跳转
	    inline: true, //实时刷新
	    port: 8080
	},

	plugins: [

		// 清除构建的目标路径
		new CleanWebpackPlugin(['dist', 'release'], {
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
		// new ExtractTextWebpackPlugin("style.css"),
		new ExtractTextWebpackPlugin({
		    filename: function (getPath) {
		    	return getPath('css/[name].css').replace('css/js', 'css');
		    	// return getPath('css/[name]-[hash].css').replace('css/js', 'css');
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
	    // new webpack.optimize.UglifyJsPlugin(),

		// 版权声明
		new webpack.BannerPlugin("Copyright Alibaba inc.")

	]
}