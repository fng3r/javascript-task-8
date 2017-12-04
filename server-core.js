'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const messages = [];

app.use(bodyParser.json());

app.get('/messages', (req, res) => {
    const query = req.query;
    const result = messages.filter(message =>
        (!query.from || message.from === query.from) &&
        (!query.to || message.to === query.to)
    );

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
});

app.post('/messages', (req, res) => {
    const message = {
        from: req.query.from,
        to: req.query.to,
        text: req.body.text
    };
    messages.push(message);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(message));
});

module.exports = app;
