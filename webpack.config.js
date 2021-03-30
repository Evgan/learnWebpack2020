const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('-----------------------  process.env.NODE_ENV = ',  process.env.NODE_ENV);


const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    };
    if (isProd) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new CssMinimizerWebpackPlugin()
        ];
    }
    return config;
};

// Что бы хэши были в PROD режиме
const fileName = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

// выносим повторяющийся код:
const cssLoaders = extra => {
    const loaders = [
        MiniCssExtractPlugin.loader,
        'css-loader',
    ];
    if (extra) {
        loaders.push(extra);
    }
    return loaders;
};

// выносим повторяющийся код:
const babelOptions = preset => {
    const result = {
        presets: ['@babel/preset-env']
    };
    if(preset) {
        result.presets.push(preset);
    }
    return result;
};

module.exports = {
    context: path.resolve(__dirname, 'src'), // указываем где лежат все исходники
    mode: 'development',
    entry: { // точки входя для webpack
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: { // куда будет сохранять результат
        // Так как входных файла два, то используем патерн NAME что бы вебпак автоматом подставил имена от входных файлов
        // а contenthash в резульирующее имя файла хэш, что бы устранить кэширование
      // filename: '[name].[contenthash].js',
      filename: fileName('js'),  // Что бы хэши были в PROD режиме
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
    // Но если есть эта настройка то вебпак умный и этот потворяющий код вынесит в отдельный файли и будет юзать её ссылку в нужных бандлах
    optimization: optimization(),
    devServer: {
        port: 3005,
    },
    module: {
        rules: [
            {
              test: /\.s[ac]ss$/, // [ac] - означает что у нас будет ловить sAss и sCss
              use: cssLoaders('sass-loader')
            },
            {
              test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // все стили пишит в итоговый отдельный css файл
                        options: {
                            // Если юзаем webpack 5 то HMR автоматически работает при webpack-dev-server
                            // hmr: isDev, // (hot modal reloading) включаем эту опцию только для режима дев
                            // reloadall: true
                        }
                    },
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
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions()
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    },
    plugins: [
        new HTMLWebPackPlugin({
            template: './index.html',
            // что бы минимизировать билдовский стартовый html файл:
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                },
            ]
        }),
        new MiniCssExtractPlugin({
            // filename: '[name].[contenthash].css'
            filename: fileName('css') // Что бы хэши были в PROD режиме
        })
    ]
};
