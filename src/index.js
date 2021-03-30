import * as $ from 'jquery';
import Post from './Post';
import './babel'
import './styles/styles.css';
import './styles/less.less';
import './styles/scss.scss';
import json from './assets/testJson';
import imgFlag from './assets/flag.jpg';

const post = new Post('Мой пост 1', imgFlag);
$('pre').html(post.toString());
console.log('-----------------------post.toString > ', post.toString());
console.log('----------------------- json:');
console.log(json);
