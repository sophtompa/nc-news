const db = require("../connection")
const format = require("pg-format");
const { convertTimestampToDate, lookUp } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
  .then (() => {
    return db.query("DROP TABLE IF EXISTS articles;");
  })
  .then (() => {
    return db.query("DROP TABLE IF EXISTS users;");
  })
  .then (() => {
    return db.query("DROP TABLE IF EXISTS topics;");
  })
  .then(() => {
    return createTables({ topicData, userData, articleData, commentData });
  });
};

function createTables({ topicData, userData, articleData, commentData }) {
  //Create topics table
  return db.query(
    `CREATE TABLE topics (
    slug VARCHAR(300) NOT NULL, 
    description VARCHAR(300) NOT NULL, 
    img_url VARCHAR(1000) NOT NULL,
    PRIMARY KEY (slug));`
  )
  //Format and insert topics data
  .then(() => {
    const formattedTopicData = topicData.map(({description, slug, img_url }) => {
      return [slug, description, img_url]
    });
    const insert = format(
      `INSERT INTO topics(slug, description, img_url) VALUES %L RETURNING *`,
      formattedTopicData
    ); 
    return db.query(insert);
  })
  //Create users table
  .then(() => {
    return db.query(
    `CREATE TABLE users(
    username VARCHAR(300) NOT NULL,
    name VARCHAR(300) NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL,
    PRIMARY KEY (username));`
  )
  })
  //Format and insert user data
  .then(() => {
    const formattedUserData = userData.map(({username, name, avatar_url}) => {
      return [username, name, avatar_url]
    });
    const insert = format(
      `INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *`,
      formattedUserData
    ); 
    return db.query(insert);
  })
  //Create articles table
  .then(() => {
    return db.query(
      `CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY NOT NULL,
      title VARCHAR(300) NOT NULL,
      topic VARCHAR(300) REFERENCES topics(slug),
      author VARCHAR(300) REFERENCES users(username), 
      body TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) NOT NULL);`
    )
  })
  //Format and insert articles data
  .then(() => {
    const formattedArticleData = articleData.map(convertTimestampToDate)
    const formattedArticles = formattedArticleData.map(({title, topic, author, body, created_at, votes, article_img_url}) => {
      return [title, topic, author, body, created_at, votes, article_img_url]
    });
    const insert = format(
      `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, formattedArticles
    );
    return db.query(insert);
  })
  //Create comments table
  .then(() => {
    return db.query(
      `CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY NOT NULL,
      article_id INT REFERENCES articles(article_id),
      body TEXT NOT NULL,
      votes INT,
      author VARCHAR(300) REFERENCES users(username),
      created_at TIMESTAMP);`
    )
  })
  .then(() => {
    return db.query(`SELECT * FROM articles;`)
  })
  //Format and insert comments data
  .then(({ rows }) => {
    //Creating object of article title and ids, for each looping over each article, for every title, it has a corresponding id
    const articleTitleIds = {}
    rows.forEach((article) => {
      articleTitleIds[article.title] = article.article_id
    })
    console.log(articleTitleIds)

    const formattedComments = commentData.map((commentData) => {
      const convertTime = convertTimestampToDate(commentData)
      const articleId = articleTitleIds[commentData.article_title]
      return [articleId, commentData.body, commentData.votes, commentData.author, convertTime.created_at]
    })
    // const lookUpVar = lookUp(rows)
    // const formattedCommentsData = commentData.map(convertTimestampToDate)
    // const formattedComments = formattedCommentsData.map(({article_id, body, votes, author, created_at}) => {
    //   return [lookUpVar[article_id], body, votes, author, created_at]
    const insert = format(
      `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L RETURNING *`, formattedComments
    );
    return db.query(insert)
    .then(({rows}) => {
      console.log(rows)
    })
  })
};

module.exports = seed;
