const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
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
const fileName = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

// выносим повторяющийся код:
const cssLoaders = (extra) => {
    const loaders = [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader'
    ];
    if (extra) {
        loaders.push(extra);
    }
    return loaders;
};

// выносим повторяющийся код:
const babelOptions = (preset) => {
    const result = {
        presets: ['@babel/preset-env']
    };
    if (preset) {
        result.presets.push(preset);
    }
    return result;
};

// Что бы eslint прикрутить только в режиме дев
const jsxLoader = () => {
    const result = [{
        loader: 'babel-loader',
        options: babelOptions('@babel/preset-react')
    }];
    if (isDev) {
        result.push('eslint-loader');
    }
    return result;
};

const config = {
    context: path.resolve(__dirname, 'src'), // указываем где лежат все исходники
    mode: 'development',
    entry: { // точки входя для webpack
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: { // куда будет сохранять результат
        // Так как входных файла два, то используем патерн NAME что бы
        // вебпак автоматом подставил имена от входных файлов
        // а contenthash в резульирующее имя файла хэш, что бы устранить кэширование
        // filename: '[name].[contenthash].js',
        filename: fileName('js'), // Что бы хэши были в PROD режиме
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        // Данная настройка позволяет при импорте файла в файл не писать расширения файлов указанных в массиве
        extensions: ['.js', '.jsx', '.ts', '.tsx'],

        // Очень полезная штука, тип биндим путь к нужным папкам и потом можем юзать из любой вложенности
        // ПРИМЕР, вместо этого: import actionExpl from '../../../../ducks/duckExpl'
        // ПОЛУЧИМ: import actionExpl from '@models/duckExpl'
        alias: {
            // '@models' : path.resolve(__dirname, 'src/models');
            // '@ducks': path.resolve(__dirname, 'src/client/redicer/ducks');
            // '@': path.resolve(__dirname, 'src');
        }
    },
    // Оптимизирует финальный бандел, к примеру мы импортируем в двух разных точках входа вешнюю библиотеку jquery,
    // и если не будет настройки chunks: "all", то для каждой точки входа в их бандлы добавится код этой блилиотеки
    // (два раза одно и тоже будет записано)
    // Но если есть эта настройка то вебпак умный и этот потворяющий код вынесит в отдельный файли и
    // будет юзать её ссылку в нужных бандлах
    optimization: optimization(),
    devServer: {
        port: 3005
    },
    // target: isDev ? 'web' : 'browserslist',
    module: {
        rules: [
            {
                test: /\.module\.s[ac]ss$/,
                // [ac] - означает что у нас будет ловить sAss и sCss
                // Добавили метку \.module, что бы модульными были только наши файлы стилей еторые будут оканчиаться
                // на module.scss и module.sass. Иначе, в случаи импорта внешней библиотеки с стилями (например bootstrap) их файлом
                // стеилей так же примениться данное изменение нейминга, что может его сломать

                // use: cssLoaders('sass-loader')
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /^((?!\.module).)*s[ac]ss$/, // все которые не заканчиваются на module.scss и module.sass
                // use: cssLoaders('sass-loader')
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
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
                // test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                // type: 'asset/resource', // встроенныый загрузчик для работы со статическими файлами
                options: {
                    limit: 10000,
                    name: 'images/[contenthash].[ext]'
                }
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions()
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: jsxLoader()
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
                }
            ]
        }),
        new MiniCssExtractPlugin({
            // filename: '[name].[contenthash].css'
            filename: fileName('css') // Что бы хэши были в PROD режиме
        })
    ]
};

if (isDev) {
    // что бы в инспекторе браузера в вкладке Sources отображался исходный код а не покасипоченый баббелам в нативный js
    config.devtool = 'source-map';
}

module.exports = config;
