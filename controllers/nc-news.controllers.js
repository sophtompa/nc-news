const endpoints = require("../endpoints.json")
const {fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, sendComment, updateArticle, removeComment, fetchUsers } = require("../models/nc-news.models")

const getEndpoints = (req, res) => {
    return res.status(200).send({endpoints});
};

const getTopics = (req, res, next) => {
    
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err);
    })
};

const getArticles = (req, res, next) => {
    const query = req.query;

    fetchArticles(query).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err);
    })
};

const getArticleById = (req, res, next) => {
    const { article_id } = req.params

    fetchArticleById(article_id).then((article) => { 
        if (article.length === 0) {
            return Promise.reject({ status: 404, msg: 'id not found' })
        }
        else {
        res.status(200).send({article: article[0]})
        }
    })
    .catch((err) => {
        next(err);
    })
}

const getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    fetchCommentsByArticleId(article_id).then((comments) => {
        if(comments.length === 0) {
            res.status(200).send({msg: "This article has no comments"})
        }
        else {
    res.status(200).send({comments})}
    })
    .catch((err) => {
        next(err);
    })
}

const postComment = (req,res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    sendComment(article_id, username, body).then((comment) => {
        return res.status(201).send({comment: comment});
    })
    .catch((err) => {
        next(err);
    })
}

const patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticle(article_id, inc_votes).then((article) => {
        return res.status(200).send({article: article})
    })
    .catch((err) => {
        next(err);
    })
}

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then((rows) => {
        return res.status(204).send(rows)
    })
    .catch((err) => {
        next(err);
    })
}

const getUsers= (req, res, next) => {
    
    fetchUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    })
};



const pathNotFound = (req, res, next) => {
    res.status(404).send({ msg: 'path not found' });
};

module.exports = { getEndpoints, getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment, patchArticle, deleteComment, getUsers, pathNotFound }
