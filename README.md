### По видосу:
https://youtu.be/eSaF8NXeNsA ОСТАНОВИЛСЯ: 1:20

### + Статьяна хабре по Webpack 5 :
https://habr.com/ru/post/524260/

### Docs for webpack:
https://webpack.js.org/

### Запуск локальной версии проекта на порту 3005 (hot reload):
"webpack-dev-server": "3.11.2" држит только с "webpack-cli": "3.3.8",

### Отлавливание режма DEVELOPMENT
1) в package.json с помощью пакета cross-env присваиваем системной переменной значение development
"start": "cross-env NODE_ENV=development webpack-dev-server --mode development --open"
2) в webpack.config.js его читакм так:
const isDev = process.env.NODE_ENV === 'development';

### ESLint
Что бы подсвечивался в редакторе нужно:
Settings > Languages & Frameworcs > JavaScript > Code Quality Tools > ESLint
указать путь для ESLint package: к \node_modules\eslint



### postcss - Автоматическое добавление css кода - итог: кросбраузерность для css
https://youtu.be/SH6Y_MQzFVw?t=1897

В scss пишем:
        display: flex;
А после обработки webpack'ом получаем:
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;


### MODULES режим для css-loader c настройкой имени класса (localIdentName)
что бы в результате в инспекторе браузера мы видели тип такого:
<div class="evganScssFile__card___1WRni">
(удобно потом понимать где что искать и решается проблема с дубликатами имен классов стилей)
Иструкция здесь: https://github.com/webpack-contrib/css-loader#auto
 
 
 module.exports = {
   module: {
     rules: [
       {
         test: /\.css$/i,
         loader: "css-loader",
         options: {
           modules: {
             localIdentName: "[path][name]__[local]--[hash:base64:5]",
           },
         },
       },
     ],
   },
 };

    

