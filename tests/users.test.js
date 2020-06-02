// npm packages
const request = require("supertest");

// app imports
const app = require("../app");

// model imports
const User = require("../models/user");

const {
  TEST_DATA,
  afterEachHook,
  afterAllHook,
  beforeEachHook
} = require("./testConfig");

beforeEach(async function () {
  await beforeEachHook(TEST_DATA);
});

afterEach(async function () {
  await afterEachHook();
});

afterAll(async function () {
  await afterAllHook();
});

describe("POST /users", function () {
    test("Create a new user", async function () {
      let dataObj = {
        username: "testuser",
        first_name: "John",
        last_name: "Mack",
        email: "test@test.com",
        password: "password",
      };
      const response = await request(app)
          .post("/users")
          .send(dataObj);
      expect(response.statusCode).toBe(201);
      const inDb = await User.findOne(response.body.username);
      ["username", "first_name", "last_name", "email"].forEach(key => {
        expect(dataObj[key]).toEqual(inDb[key]);
      });
    });

    test("Non-matching schema data won't create new user", async function () {
      let dataObj = {
        username: "testuser",
        first_name: "John",
        last_name: "Mack",
        email: "test@test.com",
        password: "1",
      };
      const response = await request(app)
          .post("/users")
          .send(dataObj);
      expect(response.body.message[0]).toBe("instance.password does not meet minimum length of 6");
      });
    });