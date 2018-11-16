const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const glob = require("glob");

// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");
const extractTextPlugin = require("extract-text-webpack-plugin");
const webpackConfigBase = require('./webpack.base.conf');

const argv = require('yargs').argv;
const project = argv.project;
const config = require('../config');

const webpackConfigProd = {
	// entry: {
	// 	templates: getTemplate()
	// },
	mode: 'development', // 通过 mode 声明环境
	watch: true,
	watchOptions: {
			//不监听的文件或者文件夹，支持正则匹配
			//默认为空
			ignored: /node_modules/,
			//监听到变化发生后会等300ms再去执行动作，防止文件更新太快
			//默认为300ms
			aggregateTimeout: 300,
			//判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的
			//默认每秒问1000次
			poll: 1000
	},
	output: {
		path: path.resolve(config.outputDir, `./${project}/`),
		// 打包多出口文件
		// 生成 a.bundle.[hash].js  b.bundle.[hash].js
		filename: 'assets/js/[name].js',
		publicPath: './'
	},
	devtool: 'cheap-source-map',
	plugins: [
		//删除dist目录
		new cleanWebpackPlugin(['assets'], {
			root: path.resolve(config.outputDir, `./${project}/`), //根目录
			// verbose Write logs to console.
			verbose: true, //开启在控制台输出信息
			// dry Use boolean "true" to test/emulate delete. (will not remove files).
			// Default: false - remove files
			dry: false,
			watch: true
		}),
		// 分离css插件参数为提取出去的路径
		new extractTextPlugin({
			filename: 'assets/css/[name].css',
		}),
		//压缩css
		// new OptimizeCSSPlugin({
		// 	cssProcessorOptions: {
		// 		safe: true
		// 	}
		// }),
		//上线压缩 去除console等信息webpack4.x之后去除了webpack.optimize.UglifyJsPlugin
		//https://github.com/mishoo/UglifyJS2/tree/harmony#compress-options
		// new UglifyJSPlugin({
		// 	uglifyOptions: {
		// 		compress: {
		// 			warnings: false,
		// 			drop_debugger: false,
		// 			drop_console: true
		// 		}
		// 	}
		// }),
		// new BundleAnalyzerPlugin(),
	],
	module: {
		rules: []
	},

}

function getTemplate () {
	// 这个函数的目的是将所有模版添加到入口中，以监听模版的改动，生产模式打包并不会将没用到的模版打包
  let globPath = `src/${project}/{components,layouts}/*/index.njk`
  // (\/|\\\\) 这种写法是为了兼容 windows和 mac系统目录路径的不同写法
  let pathDir = 'src(\/|\\\\)pages(\/|\\\\)(.*?)(\/|\\\\)'
  let files = glob.sync(globPath)
	files = files.map(file => path.resolve(__dirname, `../${file}`))
	// console.log(files)
  return files
}

module.exports = merge(webpackConfigBase, webpackConfigProd);