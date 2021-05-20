const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const questions = require('./questions.json');

app.get('/questions.json', function(req, res) {
    if (!taking_responses()) {
	console.log('attempt to get questions.json');
	res.header('Content-Type', 'application/json');
	res.send('[]');
    }
    console.log('serving questions.json');
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(questions));
});

if (!module.parent) {
    app.listen(port);
    console.log(`Listening on ${port}`);
}
