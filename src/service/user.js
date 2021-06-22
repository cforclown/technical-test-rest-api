const mongoose = require("mongoose");
const ApiError = require("../error/api-error");
const CryptoJS = require("crypto-js");

class UserService {
    constructor({ userDao }) {
        this.userDao = userDao;

        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.getAll = this.getAll.bind(this);
        this.find = this.find.bind(this);

        this.update = this.update.bind(this);

        this.delete = this.delete.bind(this);
    }

    async create({ email, password, confirmPassword, name, dob, address, description }) {
        if (password !== confirmPassword) {
            throw ApiError.badRequest("Password and confirmation password is not match");
        }
        if (!this.validateEmail(email)) {
            throw ApiError.badRequest("Email not valid");
        }

        const hashedPassword = await CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
        const user = await this.userDao.create({ email, hashedPassword, name, dob, address, description });

        return user;
    }

    async get(userId) {
        const user = await this.userDao.get(userId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }
    async authenticate(email, password) {
        const hashedPassword = await CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
        const user = await this.userDao.authenticate(email, hashedPassword);
        if (!user) {
            return null;
        }

        return user;
    }
    async getAll() {
        const userList = await this.userDao.getAll();
        return userList;
    }
    async find(query) {
        const userList = await this.userDao.find(query);
        return userList;
    }

    async update({ _id, name, dob, address, description }) {
        const user = await this.userDao.update({ _id, name, dob, address, description });
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }

    async delete(userId) {
        const deletedUserId = await this.userDao.delete(userId);
        if (!deletedUserId) {
            throw ApiError.notFound("User not found");
        }
        return deletedUserId;
    }

    validateEmail(email) {
        const emailre = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        if (!email) {
            return false;
        }
        if (email.length > 254) {
            return false;
        }

        const isValid = emailre.test(email);
        if (!isValid) {
            return false;
        }

        // Further checking of some things regex can't handle
        const parts = email.split("@");
        if (parts[0].length > 64) {
            return false;
        }

        const domainParts = parts[1].split(".");
        if (domainParts.some((part) => part.length > 63)) {
            return false;
        }

        return true;
    }
}

const userDao = require("../dao/user");
module.exports = new UserService({ userDao });
//#endregion
