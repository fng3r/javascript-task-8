'use strict';

module.exports.execute = execute;
module.exports.isStar = true;

const PROTOCOL = 'http';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;
const BASE_PATH = 'messages/';

const argparse = require('argparse');
const got = require('got');
const { format: formatUrl } = require('url');
const { formatMessage } = require('./message-formatter.js');

const parser = createParser();
const commandFunctions = {
    'list': listCommand,
    'send': sendCommand,
    'edit': editCommand,
    'delete': deleteCommand
};

function execute() {
    const args = parser.parseArgs(process.argv.slice(2));
    const query = createQueryFrom(args);
    const { id, text, verbose } = args;
    const params = {
        query,
        path: id,
        body: { text },
        verbose
    };
    const command = args.command;

    return commandFunctions[command](params);
}

function createQueryFrom(args) {
    const query = {};

    if (args.from) {
        query.from = args.from;
    }

    if (args.to) {
        query.to = args.to;
    }

    return query;
}

function listCommand(params) {
    return sendRequest(params)
        .then(res => res.body.map(m => formatMessage(m, params.verbose)).join('\n\n'));
}

function sendCommand(params) {
    return sendRequest(params, 'post')
        .then(res => formatMessage(res.body, params.verbose));
}

function editCommand(params) {
    return sendRequest(params, 'patch')
        .then(res => formatMessage(res.body, params.verbose));
}

function deleteCommand(params) {
    return sendRequest(params, 'delete')
        .then(res => {
            if (res.body && res.body.status === 'ok') {
                return 'DELETED';
            }
        });
}

function sendRequest({ path, query, body }, method = 'get') {
    const url = formatUrl({
        protocol: PROTOCOL,
        hostname: DEFAULT_HOST,
        port: DEFAULT_PORT,
        pathname: BASE_PATH + path,
        query
    });

    return got(url, { method, body, json: true });
}

function createParser() {
    const argparser = new argparse.ArgumentParser();

    argparser.addArgument('command', {
        help: 'command name',
        choices: ['send', 'list', 'delete', 'edit']
    });

    argparser.addArgument('--from', { help: 'message sender' });
    argparser.addArgument('--to', { help: 'message recipient' });
    argparser.addArgument('--text', { help: 'message text', defaultValue: '' });
    argparser.addArgument('--id', { help: 'message id', defaultValue: '' });
    argparser.addArgument('-v', {
        help: 'show message details',
        action: 'storeTrue',
        dest: 'verbose'
    });

    return argparser;
}
