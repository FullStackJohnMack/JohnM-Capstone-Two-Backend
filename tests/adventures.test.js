// npm packages
const request = require("supertest");

// app imports
const app = require("../app");

// model imports
const Adventure = require("../models/adventure");

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

describe("GET /adventures/:adventure_id", function () {
  test("Gets one adventure", async function () {
    const response = await request(app)
        .get(`/adventures/${parseInt(TEST_DATA.currentAdventure.adventure_id)}`)
    expect(response.body.adventure.name).toEqual("Test Adventure");
  });
});

describe("GET /adventures", function () {
  test("Gets all adventures", async function () {
    const response = await request(app)
        .get("/adventures")
    expect(response.body.adventures[0].name).toEqual("Test Adventure");
  });
});

describe("POST /adventures", function () {
    test("Logged in user can create a new adventure", async function () {
      let dataObj = {
        name: "Big Adventure",
        description: "A really big adventure",
        category_id: 1,
        starting_location: "123,-123",
        min_duration: 60,
        token: TEST_DATA.userToken
      };
      const response = await request(app)
          .post("/adventures")
          .send(dataObj);
      expect(response.statusCode).toBe(201);
      const inDb = await Adventure.findOne(response.body.adventure_id);
      ["name", "description", "starting_location"].forEach(key => {
        expect(dataObj[key]).toEqual(inDb[key]);
      });
    });

    test("Logged out user cannot create adventure", async function () {
      let dataObj = {
        name: "Big Adventure",
        description: "A really big adventure",
        category_id: 1,
        starting_location: "123,-123",
        min_duration: 60
      };
      const response = await request(app)
          .post("/adventures")
          .send(dataObj);
      expect(response.statusCode).toBe(401);
    });

    test("Non matching schema won't post", async function () {
      let dataObj = {
        name: "Big Adventure",
        description: "A really big adventure",
        category_id: 1,
        starting_location: "123,-123",
        min_duration: "One hour",
        token: TEST_DATA.userToken
      };
      const response = await request(app)
          .post("/adventures")
          .send(dataObj);
      expect(response.body.message[0]).toBe("instance.min_duration is not of a type(s) integer");
    });
});

describe("PATCH /adventures/:adventure_id", function () {
  test("Admin can updates an adventure", async function () {
    let dataObj = {
      name: "Small Adventure",
      token: TEST_DATA.adminToken
    };
    const response = await request(app)
        .patch(`/adventures/${parseInt(TEST_DATA.currentAdventure.adventure_id)}`)
        .send(dataObj);
    expect(response.body.name).toEqual("Small Adventure");
    const inDb = await Adventure.findOne(response.body.adventure_id);
    ["name"].forEach(key => {
      expect(dataObj[key]).toEqual(inDb[key]);
    });
  });

  test("Non-admin cannot update an adventure", async function () {
    let dataObj = {
      name: "Small Adventure",
      token: TEST_DATA.userToken
    };
    const response = await request(app)
        .patch(`/adventures/${parseInt(TEST_DATA.currentAdventure.adventure_id)}`)
        .send(dataObj);
    expect(response.body.message).toEqual("You must be an admin to access.");
  });
  
  test("Non-matching schema data won't patch", async function () {
    let dataObj = {
      category_id: "Six",
      token: TEST_DATA.adminToken
    };
    const response = await request(app)
        .patch(`/adventures/${parseInt(TEST_DATA.currentAdventure.adventure_id)}`)
        .send(dataObj);
    expect(response.statusCode).toEqual(400);
    expect(response.body.message[0]).toEqual("instance.category_id is not of a type(s) integer");
  });
});

describe("DELETE /adventures/:adventure_id", function () {
  test("Admin deletes one adventure", async function () {
    const response = await request(app)
        .delete(`/adventures/${parseInt(TEST_DATA.currentAdventure.adventure_id)}`)
        .send({token: `${TEST_DATA.adminToken}`});
    expect(response.body).toEqual({message: "Adventure deleted"});
  });

  test("Non-admin user cannot delete one adventure", async function () {
    const response = await request(app)
        .delete(`/adventures/${parseInt(TEST_DATA.currentAdventure.adventure_id)}`)
        .send({token: `${TEST_DATA.userToken}`});
    expect(response.body.message).toEqual("You must be an admin to access.");
  });
  
  test("Logged out users cannot delete an adventure", async function () {
    const response = await request(app)
        .delete(`/adventures/${parseInt(TEST_DATA.currentAdventure.adventure_id)}`)
    expect(response.body.message).toEqual("You must be an admin to access.");
  });

  test("Responds with a 404 if it cannot find the adventure in question", async function () {
    const response = await request(app)
        .delete(`/adventures/98766453`)
        .send({token: `${TEST_DATA.adminToken}`});
    expect(response.statusCode).toBe(404);
  });
});