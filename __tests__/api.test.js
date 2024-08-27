const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET/api/topics", () => {
  it("status: 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  it("status: 200, responds with topics data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((item) => {
          expect(item).toHaveProperty("slug");
          expect(item).toHaveProperty("description");
        });
      });
  });
});

describe("GET/api", () => {
  it("status: 200, responds with all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endPoints).toHaveProperty("GET /api");
      });
  });
  it("should return json format", () => {
    return request(app).get("/api").expect("Content-Type", /json/);
  });
  it("status: 404, returns an error if endpoint doesn't exist", () => {
    const url = "/api/testendpoint";
    return request(app)
      .get(url)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Endpoint ${url} Not Found`);
      });
  });
});
describe("GET/api/articles/:article_id", () => {
  it("status: 200, responds with the article with relevant id with the correct data type", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
        expect(body.article).toHaveProperty("article_id", expect.any(Number));
        expect(body.article).toHaveProperty("title", expect.any(String));
        expect(body.article).toHaveProperty("topic", expect.any(String));
        expect(body.article).toHaveProperty("author", expect.any(String));
        expect(body.article).toHaveProperty("body", expect.any(String));
        expect(body.article).toHaveProperty("created_at", expect.any(String));
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });
  it("status 400, responds with a message when the id datatype is not valid", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid info");
      });
  });
  it("status 404, responds with a message if id doesn't exist", () => {
    return request(app)
      .get("/api/articles/8500")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id 8500 Not Found");
      });
  });
});
