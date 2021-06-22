process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;
const request = require("supertest");

const database = require("../src/database");
const server = require("../src/app");

const userModel = require("../src/database/model/user.model").Model;
const global = require("../src/global");
const ErrorDump = require("../src/error-dump");

const userAdmin = {
    email: "admin@gmail.com",
    password: "admin",
    name: "admin",
    dob: "1-1-2021",
    address: "admin",
    description: "admin",
};
var sampleUserData = {
    email: "test@gmail.com",
    password: "test",
    name: "test",
    dob: "1-1-2021",
    address: "test",
    description: "test",
};

describe("TESTING /api/user", () => {
    // BEFORE TESTING
    before((done) => {
        database
            .connect()
            .then(async () => {
                // USER ADMIN
                const userAdminDoc = new userModel({
                    ...userAdmin,
                    password: await global.Hash(userAdmin.password),
                });
                await userAdminDoc.save();

                done();
            })
            .catch((err) => done(err));
    });

    // AFTER TESTING
    after(async () => {
        try {
            await userModel.collection.drop();
        } catch (err) {
            ErrorDump(err, false);
            throw err;
        }
    });

    // BEFORE EVERY TEST, LOGIN BEFORE EVERY TEST
    beforeEach(async () => {
        try {
            // USER ADMIN LOGIN
            const adminLoginResponse = await request(server).post("/auth/login/test").send({ email: userAdmin.email, password: userAdmin.password });
            if (adminLoginResponse.status !== 200 && adminLoginResponse.status !== 302) {
                throw Error("Login failed");
            }

            expect(adminLoginResponse).to.contain.property("text");

            const adminLoginResponseBody = JSON.parse(adminLoginResponse.text);

            expect(adminLoginResponseBody).to.be.an("object");
            expect(adminLoginResponseBody).to.contain.property("data");

            const adminTokenData = adminLoginResponseBody.data;
            expect(adminTokenData).to.contain.property("accessToken");
            expect(adminTokenData).to.contain.property("refreshToken");
            expect(adminTokenData).to.contain.property("userData");

            userAdmin._id = adminTokenData.userData.userId;
            userAdmin.accessToken = adminTokenData.accessToken;
        } catch (err) {
            ErrorDump(err, false);
            throw err;
        }
    });
    // AFTER EVERY TEST
    // afterEach(done=>{
    // })

    describe("[GET]", () => {
        it("GET USER LIST", (done) => {
            request(server)
                .get("/api/user")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("array");

                    done();
                });
        });

        it("FIND USERs", (done) => {
            request(server)
                .get("/api/user?search=admin")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("array");

                    done();
                });
        });

        it("GET USER BY ID", (done) => {
            request(server)
                .get("/api/user/" + userAdmin._id)
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    done();
                });
        });
    });

    describe("[POST]", () => {
        it("CREATE USER", (done) => {
            request(server)
                .post("/api/user")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .send({
                    email: "create@gmail.com",
                    password: "password",
                    confirmPassword: "password",
                    name: "name",
                    dob: "1-1-2021",
                    address: "address",
                    description: "description",
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    sampleUserData = data;

                    done();
                });
        });

        it("CREATE USER - BAD REQUEST", (done) => {
            request(server)
                .post("/api/user")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    done();
                });
        });
    });

    describe("[PUT]", () => {
        it("UPDATE USER", (done) => {
            request(server)
                .put("/api/user")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .send({
                    _id: sampleUserData._id,
                    name: "name",
                    dob: "1-1-2021",
                    address: "address",
                    description: "description",
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    done();
                });
        });

        it("UPDATE USER - BAD REQUEST", (done) => {
            request(server)
                .put("/api/user")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    done();
                });
        });
    });

    describe("[DELETE]", () => {
        it("DELETE USER", (done) => {
            request(server)
                .delete("/api/user/" + sampleUserData._id)
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("string");

                    done();
                });
        });
    });
});
