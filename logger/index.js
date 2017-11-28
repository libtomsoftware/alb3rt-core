'use strict';

const chalk = require('chalk'),
    warning = chalk.keyword('orange'),
    helpers = require('../helpers'),
    http = require('../http'),
    ROOT_PATH = process.cwd(),
    PACKAGE_CONFIG = require(ROOT_PATH + '/package.json'),
    dbGatewayUrl = process.env.URL_DB_GATEWAY,
    appId = process.env.APP_ID || PACKAGE_CONFIG.name,
    noop = () => {};

module.exports = new class Alb3rtLogger {
    error(fileId, message) {
        console.log(chalk.black.bgRedBright(` ${fileId} `), chalk.redBright(`${helpers.currentTimestamp} ${message}`));
        this.store('error', message);
    }

    warn(fileId, message, dbEntry) {
        console.log(warning(`${helpers.currentTimestamp} [${fileId}]`), chalk.yellow(message));
        this.store('warn', message);
    }

    log(fileId, message, dbEntry) {
        console.log(chalk.gray(`${helpers.currentTimestamp} [${fileId}] ${message}`));
        (dbEntry ? this.store : noop)('log', message);
    }

    info(fileId, message, dbEntry) {
        console.log(chalk.cyan(`${helpers.currentTimestamp} [${fileId}] ${message}`));
        (dbEntry ? this.store : noop)('info', message);
    }

    store(type, message) {
        if (dbGatewayUrl) {
            const body = {
                _id: `entry-${appId}-${helpers.currentTimestamp}`,
                file: fileId,
                type,
                message,
            };

        
            http.put({
                url: `${dbGatewayUrl}/api/logs`, 
                body
            });
        }
    }

};
