const endpoints = require("../endpoints.json")
const {fetchTopics} = require("../models/nc-news.models")

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


const pathNotFound = (req, res, next) => {
    res.status(404).send({ msg: 'path not found' });
};


module.exports = { getEndpoints, getTopics, pathNotFound }
