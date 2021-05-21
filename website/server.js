const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

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

app.post('/register-user', function(req, res) {
    const user = req.body;
    console.log(user);
    res.sendStatus(200);
});

if (!module.parent) {
    app.listen(port);
    console.log(`Listening on ${port}`);
}
