const request = require("supertest");
const app = require("../../../app");

describe("Roles Controller", () => {
    beforeAll(async () => {
        // Setup any necessary data before tests
        // E.g., create mock roles or permissions in your database
    });

    afterAll(async () => {
        // Clean up after tests
        // E.g., delete mock data from the database
    });

    it("should create a new role", async () => {
        const roleData = {
            name: "Test Role",
            description: "Test Role Description",
            permissionIds: [1, 2, 3], // Example permissions
        };

        const res = await request(app).post("/api/roles").send(roleData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("Role created successfully.");

        expect(res.body.data).toBeDefined();
        expect(res.body.data.roleName).toEqual(roleData.name);
    });

    it("should return 400 if role creation data is invalid", async () => {
        const invalidRoleData = {
            description: "Invalid Role Description",
            permissionIds: [1, 2, 3],
        };

        const res = await request(app).post("/api/roles").send(invalidRoleData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toContain(
            "Name, description, and permissions are required."
        );
    });
});
