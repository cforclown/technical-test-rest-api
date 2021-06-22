/* eslint-disable class-methods-use-this */
const jwt = require("jsonwebtoken");
const config = require("../config");
const dro = require("../dro");
const ErrorDump = require("../error-dump");

const accessTokenExpIn = parseInt(config.ACCESS_TOKEN_EXP_IN);
const refreshTokenExpIn = parseInt(config.ACCESS_TOKEN_EXP_IN) * 2;

class AuthController {
    constructor({ userService, tokenService }) {
        this.userService = userService;
        this.tokenService = tokenService;

        this.removeTokenTasks = [];

        this.startRemoveTokenTask = this.startRemoveTokenTask.bind(this);
        this.stopRemoveTokenTask = this.stopRemoveTokenTask.bind(this);

        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.verify = this.verify.bind(this);
        this.error = this.error.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
    }

    async register(req, res) {
        try {
            const user = await this.userService.register(req.body);

            const userData = {
                userId: user._id,
            };
            const accessToken = jwt.sign(userData, config.ACCESS_TOKEN_SECRET, {
                expiresIn: `${accessTokenExpIn}s`,
            });
            const refreshToken = jwt.sign(userData, config.REFRESH_TOKEN_SECRET, {
                expiresIn: `${refreshTokenExpIn}s`,
            });

            await this.tokenService.addToken(userData.userId, refreshToken);
            this.startRemoveTokenTask(refreshToken);

            res.send(
                dro.response({
                    userData,
                    accessToken,
                    refreshToken,
                })
            );
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
    async login(req, res) {
        try {
            const user = await this.userService.authenticate(req.body.email, req.body.password);
            if (!user) {
                return res.status(404).send(dro.errorResponse("USER NOT FOUND"));
            }

            const userData = {
                userId: user._id,
                name: user.name,
            };
            const accessToken = jwt.sign(userData, config.ACCESS_TOKEN_SECRET, {
                expiresIn: `${accessTokenExpIn}s`,
            });
            const refreshToken = jwt.sign(userData, config.REFRESH_TOKEN_SECRET, {
                expiresIn: `${refreshTokenExpIn}s`,
            });

            await this.tokenService.addToken(userData.userId, refreshToken);
            this.startRemoveTokenTask(refreshToken);

            res.send(dro.response(new TokenResponse(userData, accessToken, refreshToken)));
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
    async verify(req, res) {
        // LOGIN SUCCESS
        try {
            const userData = {
                userId: req.user._id,
                name: user.name,
            };
            const accessToken = jwt.sign(userData, config.ACCESS_TOKEN_SECRET, {
                expiresIn: `${accessTokenExpIn}s`,
            });
            const refreshToken = jwt.sign(userData, config.REFRESH_TOKEN_SECRET, {
                expiresIn: `${refreshTokenExpIn}s`,
            });

            await this.tokenService.addToken(userData.userId, refreshToken);
            this.startRemoveTokenTask(refreshToken);

            res.send(dro.response(new TokenResponse(userData, accessToken, refreshToken)));
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
    async error(req, res) {
        // LOGIN FAILED
        res.status(404).send(dro.response(null, "Authentication error"));
    }

    async refresh(req, res) {
        try {
            if (!(await this.tokenService.isExists(req.body.refreshToken))) return res.sendStatus(403);

            jwt.verify(req.body.refreshToken, config.REFRESH_TOKEN_SECRET, async (err, user) => {
                if (err) return res.sendStatus(403);

                const userData = {
                    userId: user.userId,
                    name: user.name,
                };
                const accessToken = jwt.sign(userData, config.ACCESS_TOKEN_SECRET, {
                    expiresIn: `${accessTokenExpIn}s`,
                });
                const refreshToken = jwt.sign(userData, config.REFRESH_TOKEN_SECRET, {
                    expiresIn: `${refreshTokenExpIn}s`,
                });

                this.stopRemoveTokenTask(req.body.refreshToken);
                await this.tokenService.addToken(userData.userId, refreshToken); // FUNGSI INI SEKALIGUS MENGHAPUS SEMUA REFRESH TOKEN BY USER ID
                this.startRemoveTokenTask(refreshToken);

                res.send(dro.response(new TokenResponse(userData, accessToken, refreshToken)));
            });
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }

    async logout(req, res) {
        try {
            if (req.headers["authorization"] === undefined) return res.sendStatus(401);

            const token = req.headers["authorization"].split(" ")[1];

            jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    // TOKEN NOT VALID
                    // STILL RETURN 200
                    return res.send(dro.response("OK"));
                }
                return res.send(dro.response("OK"));
            });
        } catch (err) {
            ErrorDump(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }

    startRemoveTokenTask(refreshToken) {
        const task = {
            refreshToken: refreshToken,
            task: setTimeout(async () => {
                try {
                    await this.tokenService.deleteToken(refreshToken);
                    this.stopRemoveTokenTask(refreshToken);
                } catch (error) {
                    ErrorDump(error, false);
                }
            }, refreshTokenExpIn * 1000),
        };
        this.removeTokenTasks.push(task);
    }
    stopRemoveTokenTask(refreshToken) {
        try {
            const task = this.removeTokenTasks.find((t) => t.refreshToken === refreshToken);
            if (!task) return;

            clearTimeout(task.task);
            const taskIndex = this.removeTokenTasks.indexOf((t) => t.refreshToken === refreshToken);
            if (taskIndex >= 0) this.removeTokenTasks.splice(taskIndex, 1);
        } catch (error) {
            ErrorDump(error, false);
            const taskIndex = this.removeTokenTasks.indexOf((t) => t.refreshToken === refreshToken);
            if (taskIndex >= 0) this.removeTokenTasks.splice(taskIndex, 1);
        }
    }
}

function TokenResponse(_userData, _accessToken, _refreshToken) {
    this.userData = {
        userId: _userData.userId,
        name: _userData.name,
    };
    this.accessToken = _accessToken;
    this.refreshToken = _refreshToken;
}

const userService = require("../service/user");
const tokenService = require("../service/token");
module.exports = new AuthController({ userService, tokenService });
