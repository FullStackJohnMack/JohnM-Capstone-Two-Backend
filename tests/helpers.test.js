const sqlForPartialUpdate = require("../helpers/partialUpdate");
const createToken = require("../helpers/createToken");

const jwt = require("jsonwebtoken");


describe("partialUpdate()", () => {
  it("should generate proper partial update query with 1 field", function () {
    const {query, values} = sqlForPartialUpdate(
        "users",
        {first_name: "Test"},
        "username",
        "testuser"
    );

    expect(query).toEqual(
        "UPDATE users SET first_name=$1 WHERE username=$2 RETURNING *"
    );

    expect(values).toEqual(["Test", "testuser"]);
  });
});

describe("createToken()", () => {
  it("should return a JWT token containing username and is_admin property when passed username and is_admin property", function() {
    const user = {
      username: "testuser",
      is_admin: true
    }
    const token = createToken(user);

    const res = jwt.decode(token);
    expect(res.is_admin).toEqual(true);
    expect(res.username).toEqual("testuser");
  });
});
