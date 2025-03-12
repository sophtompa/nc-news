const endpoints = require("../endpoints.json")
const {fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, sendComment } = require("../models/nc-news.models")

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
    
    fetchArticles().then((articles) => {
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
        console.log(comment)
        return res.status(201).send({comment: comment});
    })
    .catch((err) => {
        next(err);
    })
}


const pathNotFound = (req, res, next) => {
    res.status(404).send({ msg: 'path not found' });
};


module.exports = { getEndpoints, getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment, pathNotFound }
