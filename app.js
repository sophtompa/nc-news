const express = require('express');
const app = express();
const db = require("./db/connection.js")
const endpoints = require("./endpoints.json")
const { getEndpoints, getTopics, pathNotFound } = require("./controllers/nc-news.controllers.js")
const { handlePsqlError, handleCustomError, handleServerError } = require('./controllers/errors.controller.js');

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics)

app.all('*', pathNotFound);

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;


