const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");

describe("Test des API articles", () => {
  let token;
  const USER_ID = "12345";

  const MOCK_ARTICLE = {
    _id: "fakeArticleId",
    title: "Test Article",
    content: "Lorem ipsum dolor sit amet...",
    user: USER_ID,
    status: "draft",
  };

  const MOCK_CREATED_ARTICLE = {
    title: "Test Created Article",
    content: "Lorem ipsum dolor sit amet...",
    user: USER_ID,
    status: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_CREATED_ARTICLE, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndUpdate");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_CREATED_ARTICLE)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_CREATED_ARTICLE.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${MOCK_ARTICLE._id}`)
      .send(MOCK_ARTICLE)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_ARTICLE.title);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${MOCK_ARTICLE._id}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
