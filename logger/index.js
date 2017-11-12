'use strict';

const chalk = require('chalk'),
    warning = chalk.keyword('orange'),
    helpers = require('../helpers');

module.exports = new class Alb3rtLogger {
    error(fileId, message) {
        console.log(chalk.black.bgRedBright(` ${fileId} `), chalk.redBright(`${helpers.currentTimestamp} ${message}`));
    }

    log(fileId, message) {
        console.log(chalk.gray(`${helpers.currentTimestamp} [${fileId}] ${message}`));
    }

    info(fileId, message) {
        console.log(chalk.cyan(`${helpers.currentTimestamp} [${fileId}] ${message}`));
    }

    warn(fileId, message) {
        console.log(warning(`${helpers.currentTimestamp} [${fileId}]`), chalk.yellow(message));
    }
};
