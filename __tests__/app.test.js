const endpointsJson = require("../endpoints.json");
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const data = require("../db/data/test-data/index.js")
const request = require("supertest")

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe('GET: /api/topics', () => {
  test('200: responds with an array of topics objects', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body}) => {
      const { topics } = body;
      topics.forEach((topic) => {
        expect(topic).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })
        )
      })
      expect(topics.length).not.toBe(0)
    })
  });
});

describe('GET: /api/articles', () => {
  test('200: responds with an array of articles objects', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      const { articles } = body;
      const articlesSorted = articles.toSorted((a, b) => {
        return b.created_at - a.created_at
      })
      expect(articles).toEqual(articlesSorted)
      articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          })
        )
      })
      expect(articles.length).not.toBe(0)
    })
  });
});

describe("GET: /api/articles/:article_id", () => {
  test('200: responds with an object of an article with the corresponsing id', () => {
    return request(app)
    .get('/api/articles/2')
    .expect(200)
    .then(({body}) => {
      const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 2,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        )
      });
  });
  test('400: responds with bad request', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('404: id not found', () => {
    return request(app)
      .get('/api/articles/999999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('id not found');
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test('200: responds with an array of comment objects from the article with the corresponsing id, where comment count > 0', () => {
    return request(app)
    .get('/api/articles/3/comments')
    .expect(200)
    .then(({body}) => {
      const { comments } = body;
      if(comments.length != 0) {
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          })
        )
      })}
      else{ 
        expect(comments).toEqual({})
      }
      });
  });
  // test('200: responds with an array of comment objects from the article with the corresponsing id, where comment count = 0', () => {
  //   return request(app)
  //   .get('/api/articles/2/comments')
  //   .expect(200)
  //   .then(({body}) => {
  //     const { comments } = body;
  //       expect(comments.length).toEqual(1)
  //       expect(comments).toEqual([{msg: "this article has no comments"}])
  //     })
      // });
  test('400: responds with bad request', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('404: id not found', () => {
    return request(app)
      .get('/api/articles/999999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('id not found');
      });
  });

  });


describe('404: return path not found for any non-specified url', () => {
  test('404: path not found', () => {
    return request(app)
      .get('/hello')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('path not found');
      });
  });
});