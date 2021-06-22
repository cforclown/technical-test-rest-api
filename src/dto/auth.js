const joi = require("joi");

module.exports = {
    register: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required(),
        name: joi.string().required(),
        dob: joi.date().required(),
        address: joi.string().allow(null).default(null),
        description: joi.string().allow(null).default(null),
    }),
    login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    }),
    refreshToken: joi.object({
        refreshToken: joi.string().required(),
    }),
};
