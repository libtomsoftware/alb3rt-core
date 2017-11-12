const fs = require('fs-extra'),
    logger = require('./logger'),
    configExists = fs.existsSync('.env.json'), //eslint-disable-line no-sync
    FILE_ID = 'index';

let core;

if (!configExists) {
    logger.error(FILE_ID, 'No .env.json file detected, booting aborted...');
} else {
    logger.log(FILE_ID, '.env.json file detected, loading...');
    require('dot-env');
    core = require('./core');
}

module.exports = core;
