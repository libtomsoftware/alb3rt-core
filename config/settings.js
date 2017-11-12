const fs = require('fs-extra');
const CONFIG = require('./index');
const responder = require('../api/common/responder');

function puts(error, stdout, stderr) { sys.puts(stdout) }

class Alb3rtSettings {
    save(settings, responseCallback) {
        const fileName = '.env.json';
        const fileContent = {};
        const parsed = JSON.parse(JSON.parse(settings.json).json);

        parsed.forEach(field => {
            fileContent[field.name.toUpperCase()] = field.value;
        });

        fs.writeFile(`./${fileName}`, JSON.stringify(fileContent, null, 4), (error) => {
            let status = CONFIG.CONSTANTS.HTTP_CODE.OK,
                message = `${fileName} file created.`;

            if (error) {
                status = CONFIG.CONSTANTS.HTTP_CODE.INTERNAL_SERVER_ERROR;
                message = `Error while creating ${fileName} file: ${error}`;
            }

            responseCallback(status, message);

            //process.exit();
        });
    }
}

module.exports = new Alb3rtSettings();