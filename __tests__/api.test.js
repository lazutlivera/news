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
        expect(body.article.article_id).toBe(3);
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
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("status 404, responds with a message if id doesn't exist", () => {
    return request(app)
      .get("/api/articles/8500")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
describe("GET/api/articles", () => {
  it("status 200, responds with array of all articles available", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);

        body.articles.forEach((item) => {
          expect(item).toHaveProperty("article_id", expect.any(Number));
          expect(item).toHaveProperty("title", expect.any(String));
          expect(item).toHaveProperty("topic", expect.any(String));
          expect(item).toHaveProperty("author", expect.any(String));
          expect(item).toHaveProperty("created_at", expect.any(String));
          expect(item).toHaveProperty("votes", expect.any(Number));
          expect(item).toHaveProperty("article_img_url", expect.any(String));
          expect(item).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
  it("status 200, articles Sorted by Date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe('GET/api/articles(sort queries)',()=>{
  it('status 200, responds with articles sorted by given property and ordered descending when order is not given', ()=>{
    return request(app)
    .get('/api/articles?sort_by=title')
    .expect(200)
    .then(({body})=>{
      expect(body.articles).toBeSortedBy('title', {descending: true })
    })
  })
  it("status 400: returns an error message when given wrong property", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Invalid Sort");
      });
  });
  it("status 400: returns an error message when no property is given", () => {
    return request(app)
      .get("/api/articles?sort_by=")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Invalid Sort");
      });
  });
  it("status 200: responds with articles sorted by given property in given order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { ascending: true });
      });
  });
  it("status 400: returns an error message when given order is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=acc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Order Command");
      });
  });
  it("status 400: returns an error message when given order is empty", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Order Command");
      });
  });
})
describe("GET/api/articles/:article_id/comments", () => {
  it("status 200, responds with comments of the article given by id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(2);
        body.comments.forEach(() => {
          expect.objectContaining({
            article_id: 3,
            body: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(String),
            comment_id: expect.any(Number),
          });
        });
      });
  });
  it("status 200, responds with an empty array if the article doesn't have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  it("status 200, comments Sorted by Date", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("status 400, responds with a message when the id datatype is not valid", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("status 404, responds with a message if id doesn't exist", () => {
    return request(app)
      .get("/api/articles/8500/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
describe("POST/api/articles/:article_id/comments", () => {
  it("status 201, adds a comment to the given article", async () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "lurker",
        body: "Test, one, two, three, check",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            article_id: 3,
            body: "Test, one, two, three, check",
            author: "lurker",
            created_at: expect.any(String),
            comment_id: expect.any(Number),
          })
        );
      });
  });
  it("status 400, retruns an error message if body or username doesn't exist", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ body: "Test, one, two, three, check" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("username and comment required");
      });
  });
});
describe("PATCH/api/articles/:article_id", () => {
  it("status 200: updates the vote count of an article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 3,
            votes: 1,
          })
        );
      });
  });

  it("status 200: decrements the vote count of an article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: 0,
          })
        );
      });
  });

  it("status 400: responds with a message when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "nan" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });

  it("status 404: responds with a message when article_id doesn't exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  it("status 400: responds with an error message if inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type");
      });
  });
});
describe("DELETE/api/comments/:comment_id", () => {
  it("status 204: deletes a comment by comment_id", async () => {
    const response = await request(app).get("/api/articles");
    const commentCount = response.body.articles[7].comment_count;
    await request(app).delete("/api/comments/1").expect(204);

    const checkRes = await request(app).get("/api/articles/9/comments");
    const commenCountAfterDel = checkRes.body.comments.length;
    expect(commentCount - 1).toBe(commenCountAfterDel);
  });

  it("status 404: responds with a message when comment_id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/5000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  it("status 400: responds with a message if invalid comment_id is given", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe("GET/api/users", () => {
  it("status 200, responds with array of all users available", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach(() => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
