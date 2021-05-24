(async function(){

const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const connectionString = 'mongodb+srv://chiru:GzupvJYHDU9TayqN@cryptonger.vcmuj.mongodb.net/Cryptonger?retryWrites=true&w=majority';
await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const { Schema } = mongoose;

const participant_schema = new Schema({
    name: {
	type: String,
	lowercase: true,
	required: true
    },
    email: {
	type: String,
	lowercase: true,
	required: true
    },
    phone_no: {
	type: String,
	lowercase: true,
	required: true
    },
    answers: [Number]
});

const Participant = mongoose.model('participants', participant_schema);

const quiz_start_time = 0;
const quiz_end_time = 0;
const question_timeout = 10 * 1000; // 30 seconds

app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'aeiohq4iougnnwru',
    resave: true,
    saveUninitialized: true,
    cookie : {
	sameSite: 'strict',
	maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

const questions = require('./questions.json');
const no_of_questions = questions.length;

app.get('/is-quiz-open', function(req, res) {
    if (true /*check current time*/) {
	res.header('Content-Type', 'application/json');
	res.send('{ "is_open" : true }');
    }
    else {
	res.header('Content-Type', 'application/json');
	res.send('{ "is_open" : false }');
    }
});

app.get('/is-registered', function(req,res) {
    console.log(req.session);
    res.header('Content-Type', 'application/json');
    if (req.session.user != undefined) {
	res.send('{ "is_registered": true }');
    }
    else {
	res.send('{ "is_registered": false }');
    }
});

app.get('/get-question', function(req, res) {
    if (!is_quiz_open) {
	res.send('quiz is closed', 404);
	return;
    }
    if (!is_user_registered(req)) {
	res.send('user not registered', 404);
	return;
    }
    console.log('a user is requesting for a question');
    if (req.session.current_question <= no_of_questions) {
	req.session.start_time = Date.now();
	res.header('Content-Type', 'application/json');
	const { question, options } = (
	    questions[req.session.current_question-1]
	);
	const to_send = { 
	    question, 
	    options, 
	    time_left: question_timeout
	};
	res.send(JSON.stringify(to_send));
    }
    else {
	console.log('user completed all questions');
	res.header('Content-Type', 'application/json');
	res.send('null');
    }
});

app.post('/submit-answer', async function(req,res) {
    if (!is_quiz_open) {
	res.send('quiz is closed', 404);
	return;
    }
    if (!is_user_registered(req)) {
	res.send('user not registered', 404);
	return;
    }
    if (Date.now() - req.session.start_time > question_timeout) {
	console.log('user timed out');
	req.session.answers[req.session.current_question-1] = -1;
	console.log(req.session.answers);
	++req.session.current_question;
	res.header('Content-Type', 'application/json');
	res.send('{ "is_timed_out": true }');
    }
    else {
	console.log(req.body.answer);
	req.session.answers[req.session.current_question-1] = req.body.answer;
	console.log(req.session.answers);
	++req.session.current_question;
	res.header('Content-Type', 'application/json');
	res.send('{ "is_timed_out": false }');
    }
    await Participant.updateOne({_id:req.session.db_id}, {answers:req.session.answers});
});

app.post('/register-user', async function(req, res) {
    if (!is_quiz_open) {
	res.send('quiz is closed', 404);
    }
    const user = req.body;
    req.session.user = user;
    req.session.start_time = Date.now();
    req.session.current_question = 1;
    req.session.answers = []
    data = await Participant.create({
	name: user.user_name,
	email: user.user_email,
	phone_no: user.user_phone,
        answers: Array(no_of_questions).fill(-1)
    });
    req.session.db_id = data._id;
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

function is_user_registered(req) {
    return (req.session.user != undefined);
}

})()
