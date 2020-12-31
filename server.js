const express = require('express');
const app = express();
const path = require('path');
const wordsModule = require('./index.js');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/word', (req, res) => {
    //`https://www.google.com/search?q=${word}+meaning`
    const value = req.query.client;
    wordsModule.updateTxt(value, words => res.send(`
    <body style="font-size:160%;background-color:#EDD1B0;">
    ${words.map(x => {
        if (!x.includes(' ')) {
            return `<a target="_blank" href="https://www.google.com/search?q=${x}+meaning">${x}</a>`
        } else {
            return x;
        }
    }).join('<br>')}
    </body>`));
});

app.get('/status', (req, res) => {
    wordsModule.status((status) => {
        res.send(`
        <body style="font-size:160%;">
        ${status.join('<br>')}
        </body>`);
    });
});


app.listen(3000);
