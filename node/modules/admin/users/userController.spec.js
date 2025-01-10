const request = require("supertest");
const app = require("../../../app");

describe("Users Controller", () => {
    beforeAll(async () => {
        // Setup any necessary data before tests
        // E.g., create mock users or roles in your database
    });

    afterAll(async () => {
        // Clean up after tests
        // E.g., delete mock data from the database
    });

    it("should create a new user", async () => {
        const userData = {
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            password: "password123",
            role_type: "admin",
        };

        const res = await request(app)
            .post("/api/users")
            .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("User created successfully.");
        // Check if user object is returned
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toEqual(userData.email);
        // Add more assertions as needed
    });

    it("should return 400 if user creation data is invalid", async () => {
        const invalidUserData = {
            email: "invalidemail",
            firstName: "John",
            lastName: "Doe",
            password: "pass", // Password too short
            role_type: "admin",
        };

        const res = await request(app)
            .post("/api/users")
            .send(invalidUserData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toContain("Invalid email format");
        // Add more assertions as needed
    });

    // Add more test cases for update, delete, and edge cases
});
