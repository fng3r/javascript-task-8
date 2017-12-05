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

    res.json(result).end();
});

app.post('/messages', (req, res) => {
    const message = {
        from: req.query.from,
        to: req.query.to,
        text: req.body.text
    };
    messages.push(message);

    res.json(message).end();
});

module.exports = app;
