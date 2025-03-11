const db = require('../db/connection.js');
const format = require('pg-format');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows;
    })
};

const fetchArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN  comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC`)
    .then(({rows}) => {
        return rows;
    })
}

const fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
        return rows;
    });
};

module.exports = { fetchTopics, fetchArticles, fetchArticleById }