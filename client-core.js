'use strict';

module.exports.execute = execute;
module.exports.isStar = true;

const PROTOCOL = 'http';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;

const argparse = require('argparse');
const got = require('got');
const { format: formatUrl } = require('url');
const chalk = require('chalk');

const colors = {
    red: chalk.hex('#f00'),
    green: chalk.hex('#0f0')
};

const parser = createParser();

function createUrl(path, query) {
    return formatUrl({
        protocol: PROTOCOL,
        hostname: DEFAULT_HOST,
        port: DEFAULT_PORT,
        pathname: path,
        query
    });
}

function execute() {
    const args = parser.parseArgs(process.argv.slice(2));
    const command = args.command;
    const query = createQueryFrom(args);
    const url = createUrl('messages', query);

    if (command === 'send') {
        return send(url, args.text);
    } else if (command === 'list') {
        return list(url);
    }
}

function list(url) {
    return got(url, { method: 'get', json: true })
        .then(res => res.body
            .map(formatMessage)
            .join('\n\n')
        );
}

function send(url, text) {
    return got(url, {
        method: 'post',
        body: { text },
        json: true
    }).then(res => formatMessage(res.body));
}

function formatMessage(message) {
    return formatMessageField('FROM', message.from, colors.red) +
           formatMessageField('TO', message.to, colors.red) +
           formatMessageField('TEXT', message.text, colors.green, '');
}

function formatMessageField(name, value, formatter, lineEnd = '\n') {
    return value ? `${formatter(name)}: ${value}${lineEnd}` : '';
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

function createParser() {
    const argparser = new argparse.ArgumentParser();

    argparser.addArgument('command', {
        help: 'command name',
        choices: ['send', 'list']
    });

    argparser.addArgument('--from', {
        help: 'message sender'
    });

    argparser.addArgument('--to', {
        help: 'message recipient'
    });

    argparser.addArgument(['--text'], {
        help: 'message text'
    });

    return argparser;
}
