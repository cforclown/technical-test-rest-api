const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const ErrorDump = require("../error-dump");

const userService = require("../service/user");

function Initialize(passport) {
    const authenticateCallback = async (username, password, done) => {
        try {
            const user = await userService.authenticate(username, password);
            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            return done(null, user);
        } catch (error) {
            ErrorDump(error, false);
            return done(error);
        }
    };

    passport.use(new LocalStrategy(authenticateCallback));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (userId, done) => {
        const user = await userService.get(userId);
        if (!user) {
            return done(null, false, { message: "Deserialize User Error" });
        }
        return done(null, user);
    });
}

module.exports = Initialize;
