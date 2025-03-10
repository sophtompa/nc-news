const db = require('../db/connection.js');
const format = require('pg-format');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        console.log(rows)
        return rows;
    })
};

module.exports = { fetchTopics }