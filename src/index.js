import Post from './Post';
import './styles/styles.css';
import json from './assets/testJson';
import imgFlag from './assets/flag.jpg';

const post = new Post('Мой пост', imgFlag);
console.log('-----------------------post.toString > ', post.toString());
console.log('----------------------- json:');
console.log(json);
