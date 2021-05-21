const express = require('express');
const app = express();
const session = require('express-session');
const port = process.env.PORT || 3000;

const quiz_start_time = 0;
const quiz_end_time = 0;

app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'aeiohq4iougnnwru',
    resave: true,
    saveUninitialized: true,
    cookie : {
	sameSite: 'strict'
    }
}));

const questions = require('./questions.json');

app.get('/is-quiz-open', function(req, res) {
    if (true /*check current time*/) {
	console.log('registering a user');
	res.header('Content-Type', 'application/json');
	res.send('{ "is_open" : true }');
    }
    else {
	console.log('user cannot register');
	res.header('Content-Type', 'application/json');
	res.send('{ "is_open" : false }');
    }
});

app.get('/is-registered', function(req,res) {
    res.header('Content-Type', 'application/json');
    if (req.session.user != undefined) {
	res.send('{ "is_registered": true }');
    }
    else {
	res.send('{ "is_registered": false }');
    }
});

app.get('/get-question', function(req, res) {
    console.log('a user is requesting for a question');
    if (false /*if question left*/) {

    }
    else {
	console.log('user completed all questions');
	res.header('Content-Type', 'application/json');
	res.send('null');
    }
});

app.post('/submit-answer', function(req,res) {

});

app.post('/register-user', function(req, res) {
    const user = req.body;
    req.session.user = user;
    req.session.start_time = Date.now();
    req.session.current_question = 1;
    res.sendStatus(200);
});

if (!module.parent) {
    app.listen(port);
    console.log(`Listening on ${port}`);
}

function is_quiz_open() {
    return true;
    // return (Date.now() > quiz_start_time && Date.now() < quiz_end_time
}
