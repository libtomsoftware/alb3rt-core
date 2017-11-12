'use strict';

const fs = require('fs-extra'),
    PythonShell = require('python-shell'),
    CONFIG = require('../config'),
    logger = require('../logger'),
    FILE_ID = 'python';

class Alb3rtPython {
    constructor() {
        this.scripts = {};
        this.run = this.run.bind(this);
        this.stop = this.stop.bind(this);
    }

    abort(id, reason) {
        logger.warn(FILE_ID, 'Aborting attempt to run script', id, 'reason:', reason);
    }

    run(id, onSuccessCallback) {
        const scriptPath = CONFIG.PYTHON_SCRIPTS_PATH + '/' + id + '.py';

        fs.exists(scriptPath, scriptExists => {
            if (!scriptExists) {
                this.abort(id, 'doesn\'t exist...');
                return;
            }

            if (this.scripts[id]) {
                this.abort(id, 'already running...');
                return;
            }

            const shell = new PythonShell(scriptPath);

            logger.log(FILE_ID, `Running script '${id}'...`);

            this.scripts[id] = shell;
            onSuccessCallback(shell);
        });
    }

    stop(id) {
        if (this.scripts[id]) {
            logger.log(FILE_ID, `Terminating script '${id}'.`);
            delete this.scripts[id];
        }
    }
}

module.exports = new Alb3rtPython();
