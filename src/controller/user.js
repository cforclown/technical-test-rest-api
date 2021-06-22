/* eslint-disable class-methods-use-this */
const dro = require("../dro");
const ErrorDump = require("../error-dump");

class UserController {
    constructor({ userService }) {
        this.userService = userService;

        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    async create(req, res) {
        try {
            const user = await this.userService.create(req.body);
            res.send(dro.response(user));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async get(req, res) {
        try {
            const user = await this.userService.get(req.params.userId);
            res.send(dro.response(user));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
    async getAll(req, res) {
        try {
            const userList = req.query.search && req.query.search !== "" ? await this.userService.find(req.query.search) : await this.userService.getAll();
            res.send(dro.response(userList));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async update(req, res) {
        try {
            const user = await this.userService.update(req.body);
            res.send(dro.response(user));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async delete(req, res) {
        try {
            const userId = await this.userService.delete(req.params.userId);
            res.send(dro.response(userId));
        } catch (err) {
            ErrorDump(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
}

const userService = require("../service/user");
module.exports = new UserController({ userService });
