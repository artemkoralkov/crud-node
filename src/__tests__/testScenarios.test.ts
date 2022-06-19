import request from "supertest";
import { v4 } from "uuid";
import { server } from "..";

// let id: string;
// describe("Scenario 1", () => {
//   it("Get all records with a GET api/users request (an empty array is expected)", async () => {
//     const response = await request(server).get("/api/users");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual([]);
//   });
//   it("A new object is created by a POST api/users request (a response containing newly created record is expected)", async () => {
//     const response = await request(server).post("/api/users").send({
//       username: "testUserName",
//       age: 20,
//       hobbies: [],
//     });
//     id = response.body.id;
//     expect(response.statusCode).toBe(201);
//     expect(response.body).toHaveProperty("id");
//     expect(response.body.username).toEqual("testUserName");
//     expect(response.body.age).toEqual(20);
//     expect(response.body.hobbies).toEqual([]);
//   });
//   it("With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)", async () => {
//     const response = await request(server).get(`/api/users/${id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.id).toEqual(id);
//     expect(response.body.username).toEqual("testUserName");
//     expect(response.body.age).toEqual(20);
//     expect(response.body.hobbies).toEqual([]);
//   });
//   it("We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id", async () => {
//     const response = await request(server)
//       .put(`/api/users/${id}`)
//       .send({ username: "testUserName1", age: 21, hobbies: ["test"] });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.id).toEqual(id);
//     expect(response.body.username).toEqual("testUserName1");
//     expect(response.body.age).toEqual(21);
//     expect(response.body.hobbies).toEqual(["test"]);
//   });
//   it("With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)", async () => {
//     const response = await request(server).delete(`/api/users/${id}`);
//     expect(response.statusCode).toBe(204);
//   });
//   it("With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)", async () => {
//     const response = await request(server).get(`/api/users/${id}`);
//     expect(response.statusCode).toBe(404);
//     expect(response.body.message).toBe("No user with such id");
//   });
// });

// describe("Scenario 2", () => {
//   it("A new object is created by a POST api/users request (a response containing newly created record is expected)", async () => {
//     const response = await request(server).post("/api/users").send({
//       username: "testUserName",
//       age: 20,
//       hobbies: [],
//     });
//     expect(response.statusCode).toBe(201);
//     expect(response.body).toHaveProperty("id");
//     expect(response.body.username).toEqual("testUserName");
//     expect(response.body.age).toEqual(20);
//     expect(response.body.hobbies).toEqual([]);
//   });
//   it("A new object is created by a POST api/users request (a response containing newly created record is expected)", async () => {
//     const response = await request(server)
//       .post("/api/users")
//       .send({
//         username: "testUserName1",
//         age: 50,
//         hobbies: ["test", "test"],
//       });
//     id = response.body.id;
//     expect(response.statusCode).toBe(201);
//     expect(response.body).toHaveProperty("id");
//     expect(response.body.username).toEqual("testUserName1");
//     expect(response.body.age).toEqual(50);
//     expect(response.body.hobbies).toEqual(["test", "test"]);
//   });
//   it("With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)", async () => {
//     const response = await request(server).get(`/api/users/${id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.id).toEqual(id);
//     expect(response.body.username).toEqual("testUserName1");
//     expect(response.body.age).toEqual(50);
//     expect(response.body.hobbies).toEqual(["test", "test"]);
//   });
//   it("We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)", async () => {
//     const response = await request(server)
//       .put(`/api/users/${id}`)
//       .send({ username: "testUserName2", hobbies: ["test"], age: 51 });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.id).toEqual(id);
//     expect(response.body.username).toEqual("testUserName2");
//     expect(response.body.age).toEqual(51);
//     expect(response.body.hobbies).toEqual(["test"]);
//   });
//   it("With a GET api/user/{userId} request, we try to get the updated record by its id (the updated record is expected)", async () => {
//     const response = await request(server).get(`/api/users/${id}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.id).toEqual(id);
//     expect(response.body.username).toEqual("testUserName2");
//     expect(response.body.age).toEqual(51);
//     expect(response.body.hobbies).toEqual(["test"]);
//   });
//   it("With a DELETE api/users/{userId} request, we delete the updated object by id (confirmation of successful deletion is expected)", async () => {
//     const response = await request(server).delete(`/api/users/${id}`);
//     expect(response.statusCode).toBe(204);
//   });
//   it("Get all records with a GET api/users request (an array with one element is expected)", async () => {
//     const response = await request(server).get("/api/users");
//     expect(response.statusCode).toBe(200);
//     expect(response.body.length).toEqual(1);
//   });
// });

describe("Scenario 3", () => {
  it("With a GET api/user/{userId} request, we try to get the record by non-existent id (the error is expected)", async () => {
    const response = await request(server).get(`/api/users/${v4()}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("No user with such id");
  });
  it("With a GET api/user/{userId} request, we try to get the record by not valid id (the error is expected)", async () => {
    const response = await request(server).get("/api/users/1234");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("Invalid id");
  });
  it("With a GET to non-existing endpoint server should answer with status code 404 and corresponding human-friendly message (the error is expected)", async () => {
    const response = await request(server).get("/home");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Route Not Found");
  });
  it("An error must be throw by a POST api/users request when body does not contain required fields (the error is expected)", async () => {
    const response = await request(server)
      .post("/api/users/")
      .send({ usename: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "Missing required fields or invalid body field types."
    );
  });
});
