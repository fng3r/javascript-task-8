'use strict';

const chalk = require('chalk');

const colors = {
    red: chalk.hex('#f00'),
    green: chalk.hex('#0f0'),
    grey: chalk.hex('#777'),
    yellow: chalk.hex('#ff0')
};

module.exports.formatMessage = (message, verbose = false) => {
    let result = '';
    if (verbose) {
        result += formatMessageField('ID', message.id, colors.yellow);
    }

    result +=
        formatMessageField('FROM', message.from, colors.red) +
        formatMessageField('TO', message.to, colors.red) +
        formatMessageField('TEXT', message.text, colors.green, '') +
        `${message.edited ? colors.grey('(edited)') : ''}`;

    return result;
};

function formatMessageField(name, value, nameFormatter, lineEnding = '\n') {
    if (!value) {
        return '';
    }

    return `${nameFormatter(name)}: ${value}${lineEnding}`;
}
