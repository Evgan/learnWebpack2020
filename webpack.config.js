const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'), // указываем где лежат все исходники
    mode: 'development',
    entry: { // точки входя для webpack
        main: './index.js',
        analytics: './analytics.js'
    },
    output: { // куда будет сохранять результат
        // Так как входных файла два, то используем патерн NAME что бы вебпак автоматом подставил имена от входных файлов
        // а contenthash в резульирующее имя файла хэш, что бы устранить кэширование
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HTMLWebPackPlugin({
            template: './index.html'
        }),
        new CleanWebpackPlugin()
    ]
};
