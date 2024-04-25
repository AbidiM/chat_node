'use strict';
const express = require('express');
const crRoute = express.Router();

const connection = require('../db');


crRoute.post('/signup', function (req, res, next) {

    console.log(req.body.name + " + " + req.body.email + " + " + req.body.password);

    connection.execute(`INSERT INTO users 
    (username, email, password) 
    VALUES (?, ?, ?);`,
        [req.body.name, req.body.email, req.body.password])
        .then(() => {
            console.log('ok');
        }).catch((err) => {
            console.log(err);
        });
    res.end();
});

crRoute.post('/login', function (req, res, next) {

    console.log(req.body.email + " + " + req.body.password);

    connection.execute('SELECT * FROM users WHERE email = ? AND password = ?;', [req.body.email, req.body.password])
        .then((result) => {
            var rawData = result[0];
            console.log(rawData);
            res.send(JSON.stringify(rawData));
        }).catch((err) => {
            console.log(err);
            res.end();
        });
});

crRoute.post('/check', function (req, res, next) {

    console.log(req.body.email);

    connection.execute('SELECT * FROM users WHERE email=?;',
        [req.body.email])
        .then((result) => {
            var data = result[0];
            console.log(res);
            if (data.length === 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(404);
        });
});

crRoute.use('/', function (req, res, next) {
    res.sendStatus(404);
})
module.exports = crRoute;