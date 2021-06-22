const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const dro = require("../../dro");
const ErrorDump = require("../../error-dump");

const router = express.Router();

const userRouter = require("./routes/user");

router.use(async (req, res, next) => {
    try {
        if (req.headers["authorization"] === undefined) {
            return res.status(401).send(dro.errorResponse("Authorization header not found"));
        }

        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
            // TOKEN NOT VALID
            if (err) {
                return res.sendStatus(401);
            }

            req.user = user;

            next();
        });
    } catch (error) {
        ErrorDump(error);
        res.status(500).send(dro.errorResponse(error.message));
    }
});

router.use("/user", userRouter);

module.exports = router;
