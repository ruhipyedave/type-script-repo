import chai from "chai";
import chaiHttp from "chai-http";
import { server } from "../src/server";
import { USER } from "../src/apis/users/model";
import { DEFAULT_ROUTER } from "../src/app";

chai.use(chaiHttp);
chai.should();
chai.use(chaiHttp);
const expect = chai.expect;
const assert = chai.assert;

const BASE_URL = `${DEFAULT_ROUTER}/users`;
describe('Users', () => {
    // describe("GET valid userś profile /", () => {
    //     it('should have email, role, status properties', () => {
    //         const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWYwMTYzYmQzZDUxYjcyN2U3OTBjMGJhIiwiZXhwIjoxNTk0MDEzMzYzLCJpYXQiOjE1OTM5MjY5NjN9.exWQtB4KANkQeU7lIv0zeKWoB3jJQvy8n3712nwYLPU";
    //         chai.request(server).get(`${BASE_URL}/profile`)
    //             .set('Authorization', token)
    //             .then(res => {
    //                 res.should.have.status(200);

    //                 res.body.should.have.property("success");
    //                 res.body.success.should.equal(true);

    //                 assert.typeOf(res.body, "object");
    //                 res.body.data.should.have.property("_id");
    //                 res.body.data._id.should.be.a("string");

    //                 res.body.data.should.have.property("email");
    //                 res.body.data.email.should.be.a("string");

    //                 res.body.data.should.have.property("role");
    //                 res.body.data.role.should.be.a("number");

    //                 res.body.data.should.have.property("status");
    //                 res.body.data.status.should.equal(USER.status.active);
    //             }).catch((error) => {
    //                 console.log("....", error);
    //             });
    //     });
    // });

    describe("GET invalid userś profile /", () => {
        it('should throw an error', () => {
            const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWYwMTYzYmQzZDUxYjcyN2U3OTBjMGJhIiwiZXhwIjoxNTk0MDEzMzYzLCJpYXQiOjE1OTM5MjY5NjN9.exWQtB4KANkQeU7lIv0zeKWoB3jJQvy8n3712nwYLPA";
            chai.request(server).get(`${BASE_URL}/profile`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).to.be.gte(400);
                    res.body.should.be.an("object");
                    res.body.should.have.property("success");
                    res.body.success.should.equal(false);
                    res.body.should.have.property("code");
                    expect(res.body.code).to.be.gte(400);
                    res.body.should.have.property("key");
                    assert.match(res.body.key, /^10\d{3}/);
                    res.body.should.have.property("error");
                    res.body.error.should.be.an("array");
                }).catch((error) => {
                    console.log("....", error);
                });
        });
    })
});