const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: { // точки входя для webpack
        main: './src/index.js',
        analytics: './src/analytics.js'
    },
    output: { // куда будет сохранять результат
        // Так как входных файла два, то используем патерн NAME что бы вебпак автоматом подставил имена от входных файлов
        // а contenthash в резульирующее имя файла хэш, что бы устранить кэширование
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebPackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin()
    ]
};
