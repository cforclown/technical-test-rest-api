const ApiError = require("../error/api-error");
const dro = require("../dro");

function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).send(dro.errorResponse(error));
        }

        // replace request body with validated value
        // because then we have applied defaults
        req.body = value;
        next();
    };
}

module.exports = validate;
