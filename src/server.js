"use strict";

const path = require("path");
const config = require("./config");
const database = require("./database");
const cl = require("./console-log");
const ErrorDump = require("./error-dump");

// CREATE FOLDER dump-log IF NOT EXIST
const fs = require("fs");
if (!fs.existsSync(path.join(__dirname, "../dump-log"))) {
    fs.mkdirSync(path.join(__dirname, "../dump-log"));
}

database
    .connect()
    .then(async () => {
        try {
            cl.LogSuccess("============================================================================");
            cl.LogSuccess(`| ${config.NODE_ENV.toUpperCase()} MODE`);
            cl.LogSuccess(`| DATABASE CONNECTED [${config.DB_NAME}]`);

            const app = require("./app");
            await app.listen(app.get("port"), app.get("host"));
            cl.LogSuccess(`| SERVER LISTENING ON PORT ${app.get("port")}`);
            cl.LogSuccess("============================================================================");
        } catch (err) {
            ErrorDump(err);
        }
    })
    .catch((err) => {
        ErrorDump(err);
        cl.LogError("!! DATABASE CONNECTION FAILED: " + err.message);
    });
