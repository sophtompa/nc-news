const db = require('../db/connection.js');
const format = require('pg-format');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows;
    })
};

const fetchArticles = (query) => {
    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN  comments ON articles.article_id = comments.article_id GROUP BY articles.article_id `
    const queryParams = []

    if(query['sort_by']) {
        const sortByString = format(`ORDER BY articles.%I `, [query['sort_by']]);
        queryString += sortByString;
    }
    else {
        queryString += 'ORDER BY articles.created_at ';
    }

    if(query['order_by']) {
        const orderVal = query['order_by']
        queryString += orderVal
    }
    else {
        const orderVal = 'DESC'
        queryString += orderVal
    }

    const queries = Object.keys(query);
    const allowedInputs = ['sort_by', 'order_by'];
        queries.forEach((query) => {
            if (!allowedInputs.includes(query)) {
            throw new Error({ status: 404, msg: 'invalid input' });
        }
        })

    return db.query(queryString, queryParams)
    .then(({rows}) => {
        return rows;
    })
    .catch((err) => {
        next(err);
    })
}

const fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
        return rows;
    });
};

const fetchCommentsByArticleId = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
    } 
    else {
        return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [id])
    }
    })
    .then(({rows}) => {
        return rows; 
    });
}

const sendComment = (article_id, username, body) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
    } 
    else {
    return db.query(`INSERT INTO comments (article_id, author, body, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *`, [article_id, username, body])
    }
    })
    .then(({rows}) => {
        return rows[0];
    });
}

const updateArticle = (article_id, inc_votes) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
    } 
    else {
    return db.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *`, [article_id, inc_votes]) 
    }
    })
    .then(({rows}) => {
    return rows[0];
    });
}

const removeComment = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({rows}) => {
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
    } 
    else {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    }
    })
    .then(({rows}) => {
        return rows;
    });
}

const fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        return rows;
    })
};

module.exports = { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, sendComment, removeComment, updateArticle, fetchUsers }