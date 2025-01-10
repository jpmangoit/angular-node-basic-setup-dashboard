const request = require("supertest");
const app = require("../../app");

describe("User Controller Tests", () => {
    it("should update user details", async () => {
        const userData = {
            firstName: "John",
            lastName: "Doe",
        };

        const res = await request(app)
            .put("/api/user")
            .send(userData)
            .expect(200);

        expect(res.body.message).toEqual("User Updated successfully");
        expect(res.body.updatedUser).toBeDefined();
        expect(res.body.updatedUser.firstName).toEqual(userData.firstName);
    });

    it("should return validation error for invalid data", async () => {
        const userData = {
            email: "invalidemail",
        };

        const res = await request(app)
            .put("/api/user")
            .send(userData)
            .expect(400);

        expect(res.body.errors).toBeDefined();
        expect(res.body.errors.length).toBeGreaterThan(0);
    });
});
