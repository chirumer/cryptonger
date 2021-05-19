credentials = require('./credentials.json');
settings = require('./settings.json');
questions = require('./questions.json');
const Discord = require('discord.js');
const client = new Discord.Client();

start_countdown = 5;
time_per_question = 5;
number_of_questions = questions.length;

participants = []

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot) { return; }
    if (msg.content == 'register' && msg.channel.type  == 'dm') {
	msg.reply('You have been registered!');
	participants.push({
	    'user' : msg.author,
	    'answers' : []
	});
    }
    if (msg.content == '!start quiz' && msg.author.id in settings['admin-ids']) {
	start_quiz();
    }
});

function start_quiz() {
    for (participant of participants) {
	quiz(participant, start_countdown, time_per_question);
    }
    while (!is_quiz_over()) {
	sleep(100);
    }
    print_leaderboard();
}

async function quiz(user, start_countdown, time_per_question) {
    msg = await user.send('starting quiz..');
    while (start_countdown) {
	await msg.edit(`Quiz starting in ${start_countdown}s`);
	sleep(1000);
    }
    await msg.delete();
}

async function sleep(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, 5000));
}

function is_quiz_over() {
    for (participant of participants) {
	if (participant.answers.length != number_of_questions) 
	    return false;
    }
    return true;
}

client.login(credentials['bot-token']);
