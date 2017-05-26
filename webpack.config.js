const path = require('path');

// webpack 依赖
const webpack = require('webpack');
const devServer = require('webpack-dev-server');

// webpack 插件
const HtmlWebpckPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

// process.argv 获取命令行使用的参数
var isDev = true;  // 不指定参数时，默认开发环境
for (var i in process.argv) {
    if (process.argv[i] === "-p" || process.argv[i] === "--production") {
        isDev = false;
        break;
    }
    if (process.argv[i] === "-d" || process.argv[i] === "--development") {
        isDev = true;
        break;
    }
}

// 定义一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);						// 根路径
const SRC_PATH = path.resolve(ROOT_PATH, 'src');				// 源文件
const DEV_PATH = path.resolve(ROOT_PATH, 'dist');				// 开发环境
const PRO_PATH = path.resolve(ROOT_PATH, 'build');				// 生成环境
const MOD_PATH = path.resolve(ROOT_PATH, 'node_modules');		// npm模块目录

// 定义一些文件
const ENTRY_JS_FILE = path.resolve(SRC_PATH, 'entry.js');
const ENTRY_HTML_FILE = path.resolve(SRC_PATH, 'index.html');

// 开发环境/生成环境的不同配置项
const OUT_PATH = isDev ? DEV_PATH : PRO_PATH;					// 构建路径
const WEBPACK_SOURCEMAP = isDev ? 'source-map' : false;			// sourcemap类型
const WEBPACK_COLORS = isDev ? true : true;
const WEBPACK_REASONS = isDev ? true : false;
const FILE_NAME_FORMAT = isDev ? '[name]' : '[name]-[hash]';	// 文件名是否hash
const SCSS_STYLE = isDev ? 'expanded' : 'compress';				// SCSS编译风格
const MINIFY_HTML_OPTIONS = isDev ? false : {					// 压缩HTML选项
	removeComments: true,
	collapseWhitespace: true
}

// Webpack配置
var WEBPACK_CONFIG = {

	// 入口文件
	entry: ENTRY_JS_FILE,

	// 打包输出路径
	output: {
		path: OUT_PATH,
		filename: `js/${FILE_NAME_FORMAT}.js`
		
		// 使用CDN
		// publicPath: 'http://cdn.com/'
	},

	// 使用Source Map
	devtool: WEBPACK_SOURCEMAP,

	// 控制台输出模式
	stats: {
		colors: WEBPACK_COLORS,
		reasons: WEBPACK_REASONS
	},

	//
	resolve: {
		extensions: ['.js'],
		alias:{}
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
				include: SRC_PATH,
	        	exclude: MOD_PATH
			},

			// 处理json格式
			{
        		test: /\.json$/,
		        loader: 'json-loader',
	        	include: SRC_PATH,
	        	exclude: MOD_PATH
	      	},

	      	// 添加对样式表的处理
			{
	        	test: /\.css$/,
	        	// loader: 'style-loader!css-loader',
		        loader: ExtractTextWebpackPlugin.extract({
		        	fallback: 'style-loader',
		        	use: `css-loader?sourceMap=true`
	        	}),
	        	include: SRC_PATH,
	        	exclude: MOD_PATH
	      	},

	      	// 编译Less
	      	{
	        	test: /\.less$/,
		        loader: ExtractTextWebpackPlugin.extract({
		        	fallback: 'style-loader',
		        	use: `css-loader?sourceMap=true!less-loader?sourceMap=true`
	        	}),
	        	include: SRC_PATH,
	        	exclude: MOD_PATH
	      	},

	      	// 编译Sass+Compass
	      	{
	        	test: /\.(scss|sass)$/,
		        loader: ExtractTextWebpackPlugin.extract({
		        	fallback: 'style-loader',
		        	use: `css-loader?sourceMap=true!ruby-sass-loader?compass=1&outputStyle=${SCSS_STYLE}&sourceMap=true`
	        	}),
	        	include: SRC_PATH,
	        	exclude: MOD_PATH
	      	},

	      	// 图片规则
	      	{
	      		test: /\.(png|jpg|gif|jpeg|svg)$/i,
	      		loader: `url-loader?limit=8192&name=img/bg/${FILE_NAME_FORMAT}.[ext]`
	      	}

		]
	},

	// 启动本地服务器:  
	// （1）node_modules/.bin/webpack-dev-server
	// （2）npm run server
	devServer: {
	    contentBase: OUT_PATH,	// 根目录
	    inline: true, 			// 实时刷新
	    port: 8080
	},

	plugins: [

		// 清除构建的目标路径
        new CleanWebpackPlugin(OUT_PATH),

		// 构建HTML文件
		new HtmlWebpckPlugin({
			template: ENTRY_HTML_FILE,
			minify: MINIFY_HTML_OPTIONS
		}),

		// 提取样式文件
		// new ExtractTextWebpackPlugin(`css/${FILE_NAME_FORMAT}.css`),
		new ExtractTextWebpackPlugin(`${FILE_NAME_FORMAT}.css`),

		// 复制文件
		new CopyWebpackPlugin([
			{
				from: path.resolve(SRC_PATH, 'img'),
				to: 'img'
			},
			{
				from: path.resolve(SRC_PATH, 'fonts'),
				to: 'fonts'
			}
		]),

		// 版权声明
		new webpack.BannerPlugin('Copyright Alibaba Inc.')

	]
}

// 生产环境的插件
if (!isDev) {
	let plugins = [

		//
		new webpack.optimize.DedupePlugin(),

		// 压缩JS文件
		new webpack.optimize.UglifyJsPlugin(),

		//
		new webpack.optimize.OccurenceOrderPlugin(),

		//
		new webpack.optimize.AggresssiveMergingPlugin()
	];

	WEBPACK_CONFIG.plugins = WEBPACK_CONFIG.plugins.concat(plugins);
}

// 对外暴露webpack配置
module.exports = WEBPACK_CONFIG