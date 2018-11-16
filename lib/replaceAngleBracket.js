// 将文档中的 &gt; &lt;转回原来的形式

function replaceAngleBracket(options) {}

replaceAngleBracket.prototype.apply = function(compiler) {
  if (compiler.hooks) {
    // webpack 4 support
    compiler.hooks.compilation.tap('replaceAngleBracket', function (compilation) {
      if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
        compilation.hooks.htmlWebpackPluginBeforeEmit.tapAsync('replaceAngleBracket', function (htmlPluginData, callback) {
          htmlPluginData.html = htmlPluginData.html.replace(/({%.+?)&lt;(.+?%})/gi,"$1<$2")
          htmlPluginData.html = htmlPluginData.html.replace(/({%.+?)&gt;(.+?%})/gi,"$1>$2")
          callback();
        });
      } else {
        // HtmlWebPackPlugin 4.x
        var HtmlWebpackPlugin = require('html-webpack-plugin');
        var hooks = HtmlWebpackPlugin.getHooks(compilation);

        hooks.beforeEmit.tapAsync('replaceAngleBracket', function (htmlPluginData, callback) {
          // console.log(compilation.assets[htmlPluginData.outputName].source());
          htmlPluginData.html = htmlPluginData.html.replace(/({%.+?)&lt;(.+?%})/gi,"$1<$2")
          htmlPluginData.html = htmlPluginData.html.replace(/({%.+?)&gt;(.+?%})/gi,"$1>$2")
          // console.log(htmlPluginData.html)
          callback();
        });
      }
    });
  } else {
    // webpack 3 support
    compiler.plugin('compilation', function (compilation) {
      compilation.plugin('html-webpack-plugin-before-emit', function (htmlPluginData, callback) {
        htmlPluginData.html = htmlPluginData.html.replace(/({%.+?)&lt;(.+?%})/gi,"$1<$2")
        htmlPluginData.html = htmlPluginData.html.replace(/({%.+?)&gt;(.+?%})/gi,"$1>$2")
        callback()
      });
    });
  }
};

module.exports = replaceAngleBracket;