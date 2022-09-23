const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test Get /launches", () => {
    test("It should respond with status code 200 ", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test Post /launches", () => {
    const completeLaunchData = {
      mission: "Pak Enterprises",
      rocket: "Badr2",
      target: "Kepler-442 b",
      launchDate: "January 4, 2025",
    };
    const launchDataWithoutDate = {
      mission: "Pak Enterprises",
      rocket: "Badr2",
      target: "Kepler-442 b",
    };
    const launchDataWithInvalidDate = {
      mission: "Pak Enterprises",
      rocket: "Badr2",
      target: "Kepler-442 b",
      launchDate: "umar",
    };
    test("It should respond with 201 created status code", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect(201)
        .expect("Content-Type", /json/);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch properties",
      });
    });
    test("It should check invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date!",
      });
    });
  });
});
