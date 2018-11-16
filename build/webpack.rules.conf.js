const extractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const argv = require('yargs').argv;
const project = argv.project;

const rules = [{
		test: /\.css$/,
		// 区别开发环境和生成环境
		use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "postcss-loader"] : extractTextPlugin.extract({
			fallback: "style-loader",
			use: ["css-loader", "postcss-loader"],
			// css中的基础路径
			publicPath: "../"

		})
	},
	{
		test: require.resolve('jquery'),
    use: [{
      loader: 'expose-loader',
      options: 'jQuery'
    },{
      loader: 'expose-loader',
      options: '$'
    }]
	},
	{
		test: /\.js$/,
		use: [{
			loader: "babel-loader",
			options: {
				compact: false
			}
		}],
		// 不检查node_modules下的js文件
		// exclude: "/node_modules/",
	},
	{
		test: /\.(png|jpg|gif|svg)$/,
		use: [{
			// 需要下载file-loader和url-loader
			loader: "url-loader",
			options: {
				limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
				// 图片文件输出的文件夹
				outputPath: "assets/images"
			}
		}]
	},
	{
		test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		loader: 'url-loader',
		options: {
			limit: 10000,
		}
	},
	{
		test: /\.html$/,
		// html中的img标签
		use: ["html-withimg-loader"]
	}, 
	{
		test: /\.njk/,
		use: [{
			loader: 'html-withimg-loader',
			options: {
				min: false
				}
			}, {
				loader: 'nunjucks-webpack-loader',
				options : {
					alias: {
						pages : path.resolve(__dirname, `../src/${project}/pages`),
            components  : path.resolve(__dirname, `../src/${project}/components`),
            layouts   : path.resolve(__dirname, `../src/${project}/layouts`)
					},
					tags: {
						blockStart: '@{%',
						blockEnd: '%}',
						variableStart: '@{{',
						variableEnd: '}}',
						commentStart: '{#',
						commentEnd: '#}'
					}
				}
		}]
},
{
		test: /\.less$/,
		// 三个loader的顺序不能变
		// 不分离的写法
		// use: ["style-loader", "css-loader", "less-loader"]
		// 区别开发环境和生成环境
		use: process.env.NODE_ENV === "development" ? [{
			loader: "style-loader"
		}, {
			loader: "css-loader"
		}, "less-loader"] : extractTextPlugin.extract({
			fallback: "style-loader",
			use: [{
				loader: "css-loader"
			}, "less-loader"],
			// css中的基础路径
			publicPath: "../../"
		})
	},
];
module.exports = rules;