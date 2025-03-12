const express = require('express');
const app = express();
const db = require("./db/connection.js")
const endpoints = require("./endpoints.json")
const { getEndpoints, getTopics, getArticles, getArticleById, getCommentsByArticleId, pathNotFound } = require("./controllers/nc-news.controllers.js")
const { handlePsqlError, handleCustomError, handleServerError } = require('./controllers/errors.controller.js');

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.all('*', pathNotFound);

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;


