import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";

jest.mock("google-auth-library");

let app: Express;
const user = {
  _id : "1234",
  name: "user1",
  email: "testUser@test.com",
  password: "1234567890",
}

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany({ 'email': user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string

describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(201);
  });

  test("Test Register exist email", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(406);
  });
  

  test("Test Login", async () => {
    const response = await request(app)
      .post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/user");
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);

  test("Test access after timeout of token", async () => {

    await new Promise(resolve => setTimeout(() => resolve("done"), 5000));

    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;
    //newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(200);
  });

  test("Test double use of refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).not.toBe(200);

    const response1 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + newRefreshToken)
      .send();
    expect(response1.statusCode).not.toBe(200);
  });

  test("Test Login with missing email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        password: "1234567890",
      });
    expect(response.statusCode).toBe(400);
  });
  test("Test refresh token with invalid token", async () => {
    const invalidRefreshToken = "invalid_refresh_token";
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + invalidRefreshToken);
    expect(response.statusCode).toBe(401);
  });
  test("Test refresh token with valid token but not in database", async () => {
    const validRefreshToken = jwt.sign({ _id: "non_existing_user_id" }, process.env.JWT_REFRESH_SECRET);
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + validRefreshToken);
    expect(response.statusCode).toBe(401);
  });

  test("Test Login with incorrect password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "incorrectpassword",
      });
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("email or password incorrect");

  });

  test("Test Logout with invalid refresh token", async () => {
    const invalidRefreshToken = "invalid_refresh_token";
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "JWT " + invalidRefreshToken);
    expect(response.statusCode).toBe(401);
  });

    it("Logout with missing authorization token ", async () => {
      const response = await request(app).post("/auth/logout").expect(401);

      expect(response.text).toContain("Unauthorized");
    });
    // it("should handle successful logout", async () => {
    //   const response = await request(app)
    //     .post("/api/auth/logout")
    //     .set("Authorization", "JWT " + newRefreshToken)
    //     .expect(200);

    //   expect(response.text).toContain("Logout successful");
    // });
    
});
describe("Google Login API", () => {
  it("Access and refresh tokens for Google login", async () => {
    const mockRes = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    const mockGoogleUser = {
      name: "Kareen Salameh",
      email: "kareensalameh3@gmail.com",
      picture: "http://kareengoogle.png",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (OAuth2Client.prototype.verifyIdToken as any).mockResolvedValue({
      getPayload: () => mockGoogleUser,
    });

    const response = await request(app)
      .post("/auth/google")
      .send({ credentialResponse: { credential: "mockedGoogleCredential" } });

    expect(response.status).toBe(200);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (OAuth2Client.prototype.verifyIdToken as any).mockRestore();

    // delete user
    await User.deleteMany({ email: mockGoogleUser.email });
  });

  it("Invalid Google credential", async () => {
    const mockRes = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    // Mock verifyIdToken function of OAuth2Client to throw an error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (OAuth2Client.prototype.verifyIdToken as any).mockRejectedValue(
      new Error("Invalid token")
    );

    // Send a request to the Google login endpoint
    const response = await request(app)
      .post("/auth/google")
      .send({ credentialResponse: { credential: "mockedGoogleCredential" } });

    // Assert response status code and error message
    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid token");
  });
});