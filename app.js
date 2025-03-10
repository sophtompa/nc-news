const express = require('express');
const app = express();
const db = require("./db/connection.js")
const endpoints = require("./endpoints.json")
const { getEndpoints } = require("./controllers/nc-news.controllers.js")

app.get("/api", getEndpoints);

module.exports = app;


