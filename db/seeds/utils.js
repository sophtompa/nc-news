const db = require("../../db/connection");
const testData = require("../data/test-data/index.js")

convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

//Create function replacing article title with article id
function lookUp(dataArray) {

  return dataArray.reduce((idLookUp, data) => {
  const { article_title, article_id } = data
  idLookUp[article_title] = article_id;
  return idLookUp;
  }, {}) 
};

module.exports = { convertTimestampToDate, lookUp }