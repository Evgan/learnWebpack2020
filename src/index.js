import Post from './Post';
import './styles/styles.css';
import json from './assets/testJson';

const post = new Post('Мой пост');
console.log('-----------------------post.toString > ', post.toString());
console.log('----------------------- json:');
console.log(json);
