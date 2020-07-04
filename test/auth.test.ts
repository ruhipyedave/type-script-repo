import chai from "chai";
import chaiHttp from "chai-http";
import { server } from "../src/server";
import { DEFAULT_ROUTER } from "../src/app";

// Assertion style
chai.should();
chai.use(chaiHttp);

describe('Auth API', () => {
    describe(`Login API`, () => {
        it('should have a token prop', () => {
            const payload = {
                "email": "one@staff.com",
                "password": "one@staff"
            }
            chai.request(server)
                .post(`${DEFAULT_ROUTER}/auth/login`).send(payload)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("token");
                    res.body.data.token.should.be.a("string");
                }).catch((error) => {
                    console.log(error);
                });
        });
    })

    describe(`Sign-up customer API`, () => {
        it('should have a message property of type string', () => {
            const payload = {
                "email": `ruhipyedave123+${Date.now()}@gmail.com`,
                "password": "ruhi@123",
                "name": "Ruhi Yedave"
            }
            chai.request(server)
                .post(`${DEFAULT_ROUTER}/auth/signup`).send(payload)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.be.a("string");
                }).catch((error) => {
                    console.log(error);
                });
        });
    })

    describe(`Sign-up customer API for existing users`, () => {
        it('should throw error', () => {
            const payload = {
                "email": `ruhipyedave123@gmail.com`,
                "password": "ruhi@123",
                "name": "Ruhi Yedave"
            }
            chai.request(server)
                .post(`${DEFAULT_ROUTER}/auth/signup`).send(payload)
                .then((res) => {
                    res.should.have.status(400);
                    res.body.should.be.an("object");
                    res.body.should.have.property("success");
                    res.body.success.should.equal(false);
                    res.body.should.have.property("code");
                    res.body.code.should.equal(500);
                    res.body.should.have.property("key");
                    res.body.key.should.equal("30004");
                    res.body.should.have.property("error");
                    res.body.error.should.be.an("array");
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    })

    describe(`Sign-up customer API`, () => {
        it('should throw error 2', () => {
            const payload = {
                "email": "ruhipyedave123+1@gmail.com",
                "password": "ruhi@123",
                "name": "Ruhi Yedave"
            };
            chai.request(server)
                .post(`${DEFAULT_ROUTER}/auth/signup`).send(payload)
                .then((res) => {
                    // console.log("res2 ---> ", res.body);
                    res.should.have.status(400);
                    res.body.should.be.an("object");
                    res.body.should.have.property("success");
                    res.body.success.should.equal(false);
                    res.body.should.have.property("code");
                    res.body.code.should.equal(500);
                    res.body.should.have.property("key");
                    res.body.key.should.equal("30004");
                    res.body.should.have.property("error");
                    res.body.error.should.be.an("array");
                }).catch((error) => {
                    console.log("2------> :", error);
                });
        });
    })

    describe(`Verify user API`, () => {
        it('should have a message property', () => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWYwMDkyOGVmYmIwZjU3MjAyZjA3OTIyIiwiZXhwIjoxNTkzODc2NjM5LCJpYXQiOjE1OTM4NzMwMzl9.le61hFDN7qypBX5hp8-nHpcyw4ft_wpw7XTeGmNlo5A";
            chai.request(server)
                .get(`${DEFAULT_ROUTER}/auth/verify?token=${token}`)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.be.a("string");
                }).catch((error) => {
                    console.log(error);
                });
        });
    })
});