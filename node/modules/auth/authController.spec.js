const request = require("supertest");
const app = require("../../app");


describe("Users Controller", () => {
    beforeAll(async () => {
        // Setup any necessary data before tests
        // E.g., create mock users or roles in your database
    });

    afterAll(async () => {
        // Clean up after tests
        // E.g., delete mock data from the database
    });

    it("should log in a user", async () => {
        const userData = {
            email: "test@example.com",
            password: "password123",
        };

        const res = await request(app)
            .post("/api/login")
            .send(userData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toBeDefined();
       
        expect(res.body.message).toEqual("User Login successfully");
        
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toEqual(userData.email);
    });

    it("should return 404 if user does not exist during login", async () => {
        const invalidUserData = {
            email: "nonexistent@example.com",
            password: "invalidpassword",
        };

        const res = await request(app)
            .post("/api/login")
            .send(invalidUserData);

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual("User not found!");
    });

    it("should register a new user", async () => {
        const userData = {
            email: "newuser@example.com",
            password: "password123",
            firstName: "New",
            lastName: "User",
            role_type: "user",
        };

        const res = await request(app)
            .post("/api/register")
            .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("User Created successfully");
       
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toEqual(userData.email);
    });
});
