class DaoError {
    constructor(status, msg) {
        const err = new Error(msg);
        err.status = statusl;
        this.err = err;
    }

    static unauthorized(msg) {
        return new DaoError(401, msg);
    }
    static forbidden(msg) {
        return new DaoError(403, msg);
    }
    static badRequest(msg) {
        return new DaoError(400, msg);
    }
    static notFound(msg) {
        return new DaoError(404, msg);
    }
    static internal(msg) {
        return new DaoError(500, msg);
    }
}

module.exports = DaoError;
