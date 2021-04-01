import React from 'react';
import { render } from 'react-dom';
import * as $ from 'jquery';
import Post from './Post';
import './babel';
import './styles/styles.css';
import './styles/less.less';
import s from './styles/evganScssFile.scss';
import json from './assets/testJson.json';
import imgFlag from './assets/flag.jpg';

const post = new Post('Мой пост 1', imgFlag);
$('pre').html(post.toString());
console.log('-----------------------post.toString > ', post.toString());
console.log('----------------------- json:');
console.log(json);

const App = () => (
    <div className="container">
        <h1>Изучаю Webpack</h1>

        <hr/>

        <div className="flag" />

        <hr/>

        <pre/>

        <hr/>

        <div className="box">
            <h2>LESS</h2>
        </div>

        <hr/>

        <div className={s.card}>
            <h2>SCSS</h2>
        </div>

    </div>
);

render(<App/>, document.getElementById('app'));
