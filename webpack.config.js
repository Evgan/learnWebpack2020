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
    resolve: {
        // extensions: ['.js', '.jsx', '.ts', '.tsx'] Данная настройка позволяет при импорте файла в файл не писать расширения файлов указанных в массиве

        // Очень полезная штука, тип биндим путь к нужным папкам и потом можем юзать из любой вложенности
        // ПРИМЕР, вместо этого: import actionExpl from '../../../../ducks/duckExpl'
        // ПОЛУЧИМ: import actionExpl from '@models/duckExpl'
        alias: {
            //'@models' : path.resolve(__dirname, 'src/models');
            //'@ducks': path.resolve(__dirname, 'src/client/redicer/ducks');
            //'@': path.resolve(__dirname, 'src');
        }
    },
    // Оптимизирует финальный бандел, к примеру мы импортируем в двух разных точках входа вешнюю библиотеку jquery,
    // и если не будет настройки chunks: "all", то для каждой точки входа в их бандлы добавится код этой блилиотеки (два раза одно и тоже будет записано)
    // Но если есть эта настройка то веббак умный и этот потворяющий код вынесит в отдельный файли и будет юзать её ссылку в нужных бандлах
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf|pdf|docx)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[hash].[ext]'
                }
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
