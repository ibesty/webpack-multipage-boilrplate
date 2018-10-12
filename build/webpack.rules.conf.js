const extractTextPlugin = require("extract-text-webpack-plugin");
const templateRule = require('art-template/lib/compile/adapter/rule.native');
console.log(templateRule)
const path = require('path');
const rules = [{
		test: /\.(css|less)$/,
		// 不分离的写法
		// use: ["style-loader", "css-loader",sass-loader"]
		// 使用postcss不分离的写法
		// use: ["style-loader", "css-loader", "sass-loader","postcss-loader"]
		// 此处为分离css的写法
		/*use: extractTextPlugin.extract({
			fallback: "style-loader",
			use: ["css-loader", "sass-loader"],
			// css中的基础路径
			publicPath: "../"
		})*/
		// 区别开发环境和生成环境
		use: process.env.NODE_ENV === "development" ? ["css-loader", "less-loader", "postcss-loader"] : extractTextPlugin.extract({
			fallback: "style-loader",
			use: ["css-loader", "less-loader", "postcss-loader"],
			// css中的基础路径
			publicPath: "../"

		})
	},
	{
		test: /\.js$/,
		use: ["babel-loader"],
		// 不检查node_modules下的js文件
		// exclude: "/node_modules/"
	}, {
		test: /\.(png|jpg|gif)$/,
		use: [{
			// 需要下载file-loader和url-loader
			loader: "url-loader",
			options: {
				limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
				// 图片文件输出的文件夹
				outputPath: "images"
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
	// {
	// 	test: /\.html$/,
	// 	// html中的img标签
	// 	use: ["html-withimg-loader"]
	// },
	// {
	// 	test: /\.(njk)$/,
	// 	use: [
	// 		{
	// 			loader: 'njk-loader',
	// 			options: {
	// 				includePaths: [
	// 					path.join(__dirname, "../src/components"),
	// 					path.join(__dirname, "../src/layouts"),
	// 					path.join(__dirname, "../src/pages")
	// 				]
	// 			}
	// 		}
	// 	]
	// },
	{
		test: /\.art$/,
		loader: "art-template-loader",
		options: {
			rules: [
				{
					test: /(@{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}})|({{$[ \t]*(\/?)([\w\W]*?)[ \t]*}})/, //vue or other javascript template
					use: function(match, raw, close, code) {
							return {
									code: `"${match.toString().slice(1)}"`,
									output: "raw"
							};
					}
			},
				require("art-template/lib/compile/adapter/rule.native")
			]
				// art-template options (if necessary)
				// @see https://github.com/aui/art-template
		}
	}
	// , {
	// 	test: /\.less$/,
	// 	// 三个loader的顺序不能变
	// 	// 不分离的写法
	// 	// use: ["style-loader", "css-loader", "less-loader"]
	// 	// 区别开发环境和生成环境
	// 	use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "less-loader"] : extractTextPlugin.extract({
	// 		fallback: "style-loader",
	// 		use: ["css-loader", "less-loader"],
	// 		// css中的基础路径
	// 		publicPath: "../"
	// 	})
	// },
];
module.exports = rules;