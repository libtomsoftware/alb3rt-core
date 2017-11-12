const fs = require('fs-extra'),
    responder = require('../../common/responder'),
    CONFIG = require('../../../config'),
    settings = require('../../../config/settings');

module.exports = new class SettingsResource {

    get(request, response) {

        fs.readFile(process.cwd() + '/.env.json', 'utf8', function (err, data) {
            if (err) {
                responder.send(response, {
                    status: CONFIG.CONSTANTS.HTTP_CODE.INTERNAL_SERVER_ERROR,
                    data: JSON.parse(data)
                });
                return;
            }

            responder.send(response, {
                status: CONFIG.CONSTANTS.HTTP_CODE.OK,
                data: JSON.parse(data)
            });
        });
    }

    put(request, response) {
        settings.save(request.body, (status, message) => {
            responder.send(response, {
                status,
                message
            });
        });
    }

};
