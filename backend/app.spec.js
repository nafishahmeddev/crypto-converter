const request = require("supertest");
const app = require("./app");
describe("GET /api/v1/currencies/latest", () => {
    it("should return a product", async () => {
        const res = await request(app).get("/api/v1/currencies/latest");
        expect(res.statusCode).toBe(200);

        const structure = {
            message: expect.any(String),
            result: {
                currencies: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        symbol: expect.any(String),
                        currencies: expect.arrayContaining([expect.any(String)]),
                    }),
                ]),
            }
        };
        expect(res.body).toEqual(structure);
    });
});

describe("POST /api/v1/currencies/convert", () => {
    it("should create a product", async () => {
        const res = await request(app).post("/api/v1/currencies/convert").send({
            id: 555,
            currency: "USD",
            amount: 100,
        });
        expect(res.statusCode).toBe(200);

        const structure = {
            message: expect.any(String),
            result: expect.objectContaining({
                id: expect.any(Number),
                currency: expect.any(String),
                amount: expect.any(Number),
                rate: expect.any(Number),
                price: expect.any(Number)
            }),
        };
        expect(res.body).toEqual(structure);
    });
});
