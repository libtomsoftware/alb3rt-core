const http = require('./http'),
    logger = require('./logger'),
    python = require('./python'),
    CONFIG = require('./config'),
    FILE_ID = 'core',
    REGISTRATION_TIMEOUT = 2000;

module.exports = new class Alb3rtCore {
    constructor() {
        this.registrationTimeoutModifier = 1;
        this.register = this.register.bind(this);
        this.onRegisterError = this.onRegisterError.bind(this);

        this.startServer();
        this.registrationTimeout = setTimeout(this.register, this.registrationTimeoutModifier * REGISTRATION_TIMEOUT);
    }

    startServer() {
        logger.log(FILE_ID, `Booting ${CONFIG.APP.NAME}...`);
        require('./http-server').boot();
    }

    register() {
        const urlRegistry = CONFIG.URL.REGISTRY;

        if (urlRegistry) {
            http.post({
                url: `http://${urlRegistry}/api/registry`,
                body: CONFIG.APP
            })
            .then(this.onRegisterSuccess)
            .catch(this.onRegisterError);
        }
    }

    onRegisterError(error) {
        logger.error(FILE_ID, `Registration failed - ${error}`);

        if (error !== CONFIG.CONSTANTS.HTTP_CODE.CONFLICT) {
            clearTimeout(this.registrationTimeout);
            this.registrationTimeoutModifier += 1;
            this.registrationTimeout = setTimeout(this.register, REGISTRATION_TIMEOUT * this.registrationTimeoutModifier);
        }
    }

    onRegisterSuccess() {
        logger.log(FILE_ID, 'Registration successful.');
    }

    get api() {
        return require('./api');
    }

    get config() {
        return require('./config');
    }

    get http() {
        return http;
    }

    get logger() {
        return logger;
    }

    get python() {
        return python;
    }
};
