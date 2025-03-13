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
      const commentsSorted = comments.toSorted((a, b) => {
        return b.created_at - a.created_at
      })
      expect(comments).toEqual(commentsSorted)
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
      })
      });
  });
  test('200: responds with a message of "article has no comments" when the comment count = 0', () => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then(({body}) => {
      expect(body.msg).toBe("This article has no comments")
    });
  })
  test('400: responds with bad request, wrong data type for article_id', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('404: article id not found', () => {
    return request(app)
      .get('/api/articles/999999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: responds with a posted comment", () => {
    return request(app)
    .post('/api/articles/5/comments')
    .send ({
      username: "butter_bridge",
      body: "newComment"
    })
    .expect(201)
    .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            comment: {
            comment_id: 19,
            votes: 0,
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "newComment",
            article_id: 5
          }})
        )
  })
  })
  test('400: responds with bad request, wrong data type for article_id', () => {
    return request(app)
      .post('/api/articles/banana/comments')
      .send ({
        username: "butter_bridge",
        body: "newComment"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('404: article id not found', () => {
    return request(app)
      .post('/api/articles/999999/comments')
      .send ({
        username: "butter_bridge",
        body: "newComment"
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200: responds with article with updated vote count", () => {
    return request(app)
    .patch('/api/articles/6')
    .send({inc_votes: 10})
    .expect(200)
    .then(({body}) => {
      const { article } = body
      expect(article).toEqual(
        expect.objectContaining({
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: expect.any(String),
            votes: 10,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
      )
    })
  });
  test('400: responds with bad request, wrong data type for article_id', () => {
    return request(app)
      .patch('/api/articles/banana')
      .send ({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('404: article id not found', () => {
    return request(app)
      .patch('/api/articles/999999')
      .send ({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
});
});

describe('DELETE: /api/comments/:comment_id', () => {
  test('204: deletes comment with corresponding comment id, returns status 204 with no content', () => {
    return request(app)
    .delete('/api/comments/5')
    .expect(204)
    .then(({body}) => {
      expect(body).toBeEmpty()
    })
  })
  test('400: responds with bad request, wrong data type for comment_id', () => {
    return request(app)
      .delete('/api/comments/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('404: comment id not found', () => {
    return request(app)
      .delete('/api/comments/999999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment not found');
      });
});
})

describe('GET: /api/users', () => {
  test('200: responds with an array of user objects', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body}) => {
      const { users } = body;
      expect(users.length).not.toBe(0)
      users.forEach((user) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        )
      })
      
    })
  });
});

describe('GET: /api/articles?', () => {
  test('200: responds with an array of articles sorted by column with number values (article_id)', () => {
    return request(app)
    .get('/api/articles?sort_by=article_id')
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      const articlesSorted = articles.toSorted((a, b) => {
        return b.article_id - a.article_id;
      });
      expect(articles).toEqual(articlesSorted);
    });
  })
  test('200: responds with an array of articles sorted by column with string values (title/topic/author/body)', () => {
    return request(app)
    .get('/api/articles?sort_by=title')
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      const articlesSorted = articles.toSorted((a, b) => {
        return b.title.localeCompare(a.title);
      });
      expect(articles).toEqual(articlesSorted);
    });
  })
  test('200: responds with an array of articles with order_by = ASC', () => {
    return request(app)
    .get('/api/articles?order_by=ASC')
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      const articlesSorted = articles.toSorted((a, b) => {
        return a.created_at - b.created_at;
      });
      expect(articles).toEqual(articlesSorted);
    });
  })
  test('200: responds with array of articles with specified topic, defaults to returning all articles', () => {
    return request(app)
    .get('/api/articles?topic=mitch')
    .then(({body}) => {
      const {articles} = body;
      expect(articles.length).toBe(12)
      articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          })
        )
      })
      
    })
  })
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