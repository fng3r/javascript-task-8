'use strict';

const { sendRequest } = require('../utils/net-utils');
const { formatMessage } = require('../utils/message-formatter');

class ListCommand {
    constructor() {
        this.name = 'list';
    }

    execute(params) {
        return sendRequest(params)
            .then(res => res.body.map(m => formatMessage(m, params.verbose)).join('\n\n'));
    }
}

class SendCommand {
    constructor() {
        this.name = 'send';
    }

    execute(params) {
        return sendRequest(params, 'post')
            .then(res => formatMessage(res.body, params.verbose));
    }
}

class EditCommand {
    constructor() {
        this.name = 'edit';
    }

    execute(params) {
        return sendRequest(params, 'patch')
            .then(res => formatMessage(res.body, params.verbose));
    }
}

class DeleteCommand {
    constructor() {
        this.name = 'delete';
    }

    execute(params) {
        return sendRequest(params, 'delete')
            .then(res => {
                if (res.body && res.body.status === 'ok') {
                    return 'DELETED';
                }
            });
    }
}

module.exports = {
    ListCommand,
    SendCommand,
    EditCommand,
    DeleteCommand
};
