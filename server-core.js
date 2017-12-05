'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');

const app = express();
const messages = Object.create(null);

app.use(bodyParser.json());

app.get('/messages', (req, res) => {
    const query = req.query;
    const result = Object.values(messages).filter(message =>
        (!query.from || message.from === query.from) &&
        (!query.to || message.to === query.to)
    );

    res.json(result);
});

app.post('/messages', (req, res) => {
    const message = {
        id: shortid.generate(),
        from: req.query.from,
        to: req.query.to,
        text: req.body.text
    };
    messages[message.id] = message;

    res.json(message);
});

app.delete('/messages/:id', (req, res) => {
    const messageId = req.params.id;
    if (!messages[messageId]) {
        return res.sendStatus(404);
    }

    delete messages[messageId];
    res.json({ status: 'ok' });
});

app.patch('/messages/:id', (req, res) => {
    const message = messages[req.params.id];
    if (!message) {
        return res.sendStatus(404);
    }

    message.text = req.body.text;
    message.edited = true;
    res.json(message);
});

module.exports = app;
