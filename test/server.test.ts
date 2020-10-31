import chai from "chai";
import chaiHttp from "chai-http";
import { server } from "../src/server";

chai.use(chaiHttp);
const expect = chai.expect;

describe('baseRoute', () => {
    describe("GET /", () => {
        it('should have a message prop', () => {
            chai.request(server).get('/')
                .then(res => {
                    expect(res.body.message).to.eql("Hello World!");
                }).catch((error) => {
                    console.log("....", error);
                });
        });
    })
});