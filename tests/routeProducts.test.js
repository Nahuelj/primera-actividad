import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test route products", async function () {
    this.timeout(10000);
    it("the status must be 200", async () => {
        const response = await requester.get("/api/products");
        expect(response.status).to.equal(200);
    });
    it("must be an object with state and payload", async () => {
        const response = await requester.get("/api/products");
        const object = response.body;
        chai.expect(object).to.have.property("status");
        chai.expect(object).to.have.property("payload");
    });
    it("must includes the pagination", async () => {
        const response = await requester.get("/api/products");
        const object = response.body;
        const paginationProps = [
            "totalDocs",
            "limit",
            "totalPages",
            "page",
            "pagingCounter",
            "hasPrevPage",
            "hasNextPage",
            "prevPage",
            "nextPage",
            "nextLink",
            "prevLink",
        ];

        paginationProps.forEach((prop) => {
            chai.expect(object).to.have.property(prop);
        });
    });
});

describe("Test route carts", async function () {
    this.timeout(10000);
    it("the status must be 200", async () => {});
    it("must be an object with state and payload", async () => {});
    it("must includes the pagination", async () => {});
});

describe("Test route session", async function () {
    this.timeout(10000);
    it("the status must be 200", async () => {});
    it("must be an object with state and payload", async () => {});
    it("must includes the pagination", async () => {});
});
