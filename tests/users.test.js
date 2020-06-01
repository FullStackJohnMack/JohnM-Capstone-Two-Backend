describe("POST /users", async function () {
    test("Creates a new user", async function () {
      let dataObj = {
        username: "whiskey",
        first_name: "Whiskey",
        last_name: "foo123",
        password: "Lane",
        email: "whiskey@rithmschool.com",
      };
      const response = await request(app)
          .post("/users")
          .send(dataObj);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");
      const whiskeyInDb = await User.findOne("whiskey");
      ["username", "first_name", "last_name"].forEach(key => {
        expect(dataObj[key]).toEqual(whiskeyInDb[key]);
      });
    });
});