process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;

const database = require("../src/database");

describe("TESTING USER SERVICEs", () => {
    let userService = null;
    let createdUser = null;

    // BEFORE TESTING
    before((done) => {
        database
            .connect()
            .then(async () => {
                database.registerModels();
                userService = require("../src/service/user");
                done();
            })
            .catch((err) => done(err));
    });

    it("CREATE", (done) => {
        userService
            .create({
                email: "create@gmail.com",
                password: "password",
                confirmPassword: "password",
                name: "name",
                dob: "1-1-2021",
                address: "address",
                description: "description",
            })
            .then((user) => {
                expect(user).to.be.an("object");
                createdUser = user;
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET", (done) => {
        userService
            .get(createdUser._id)
            .then((user) => {
                expect(user).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("AUTHENTICATE", (done) => {
        userService
            .authenticate("create@gmail.com", "password")
            .then((user) => {
                expect(user).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET ALL", (done) => {
        userService
            .getAll()
            .then((userList) => {
                expect(userList).to.be.an("array");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("UPDATE", (done) => {
        userService
            .update({
                _id: createdUser._id,
                name: "name",
                dob: "1-1-2021",
                address: "address",
                description: "description",
            })
            .then((result) => {
                expect(result).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("DELETE", (done) => {
        userService
            .delete(createdUser._id.toString())
            .then((deletedUserId) => {
                expect(deletedUserId).to.be.an("string");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
});
