import supertest from "supertest";
import chai from "chai";
import { UserModel } from "../src/dao/models/user.model.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test route products", async function () {
    this.timeout(10000);
    it("the status must be 200", async () => {
        try {
            const response = await requester.get("/api/products");
            expect(response.status).to.equal(200);
        } catch (error) {
            console.log("Somenting went wrong");
            throw error;
        }
    });
    it("must be an object with state and payload", async () => {
        try {
            const response = await requester.get("/api/products");
            const object = response.body;
            chai.expect(object).to.have.property("status");
            chai.expect(object).to.have.property("payload");
        } catch (error) {
            console.log("Somenting went wrong");
            throw error;
        }
    });
    it("must includes the pagination", async () => {
        try {
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
        } catch (error) {
            console.log("Somenting went wrong");
            throw error;
        }
    });
});

describe("Test route carts", async function () {
    this.timeout(10000);
    it("the status must be 200", async () => {
        try {
            const response = await requester.get("/api/carts");
            expect(response.status).to.equal(200);
        } catch (error) {
            console.log("Somenting went wrong");
            throw error;
        }
    });
    it("must be an array of products", async () => {
        try {
            const response = await requester.get("/api/carts");
            const object = response.body;
            chai.expect(object).to.be.instanceOf(Array);
        } catch (error) {
            console.log("Somenting went wrong");
            throw error;
        }
    });
    it("must includes the property products and _id", async () => {
        try {
            const response = await requester.get("/api/carts");
            const object = response.body;
            object.forEach((cart) => {
                chai.expect(cart).to.have.property("products");
                chai.expect(cart).to.have.property("_id");
            });
        } catch (error) {
            console.log("Somenting went wrong");
            throw error;
        }
    });
});

// describe("Test route session", async function () {
//     this.timeout(20000);
//     it("if the user exists the registration should redirect /failregister", async () => {
//         try {
//             const requestBody = {
//                 first_name: "user",
//                 last_name: "test",
//                 age: 30,
//                 email: "usertest1235@gmail.com",
//                 password: "1234",
//             };
//             const response = await requester
//                 .post("/session/register")
//                 .send(requestBody);
//             const object = response.text;

//             expect(object).to.equal("Found. Redirecting to /failregister");
//         } catch (error) {
//             console.log("Something went wrong", error);
//             throw error;
//         }
//     });

//     it("if the user does not exists the registration should redirect /login", async () => {
//         try {
//             const requestBody = {
//                 first_name: "user",
//                 last_name: "test",
//                 age: 30,
//                 email: "usertest1234@gmail.com",
//                 password: "1234",
//             };
//             const response = await requester
//                 .post("/session/register")
//                 .send(requestBody);
//             const object = response.text;
//             console.log(
//                 "🚀 ~ file: testRoutes.test.js:130 ~ it ~ object:",
//                 object,
//             );

//             expect(object).to.equal("Found. Redirecting to /login");
//         } catch (error) {
//             console.log("Something went wrong", error);
//             throw error;
//         }
//     });
// });
