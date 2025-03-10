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
  db.end();
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



//General Errors, 404: path not found, PSQL errors, custom error, server error

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