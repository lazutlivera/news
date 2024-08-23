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
