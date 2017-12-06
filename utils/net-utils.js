'use strict';

const PROTOCOL = 'http';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;
const BASE_PATH = 'messages/';

const { format: formatUrl } = require('url');
const got = require('got');

module.exports.sendRequest = ({ path, query, body }, method = 'get') => {
    const url = formatUrl({
        protocol: PROTOCOL,
        hostname: DEFAULT_HOST,
        port: DEFAULT_PORT,
        pathname: BASE_PATH + path,
        query
    });

    return got(url, { method, body, json: true });
};
