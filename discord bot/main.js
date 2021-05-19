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
    if (msg.content == '!start quiz' && settings['admin-ids'].includes(msg.author.id)) {
	start_quiz(participants);
    }
});

async function start_quiz(participants) {
    outcomes = []
    for (participant of participants) {
	outcomes.push(quiz(participant, start_countdown, time_per_question));
    }
    outcomes = await Promise.all(outcomes);
    console.log('all done');
    print_leaderboard();
}

async function quiz(participant, start_countdown, time_per_question) {
    msg = await participant.user.send('starting quiz..');
    while (start_countdown--) {
	await console.log(participant.user.id, start_countdown);
//	await msg.edit(`Quiz starting in ${start_countdown}s`);
	await participant.user.send(`Quiz starting in ${start_countdown}s`);
	await sleep(1000);
    }
    await msg.delete();
}

async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function is_quiz_over() {
    for (participant of participants) {
	if (participant.answers.length != number_of_questions) 
	    return false;
    }
    return true;
}

function print_leaderboard() {
}

client.login(credentials['bot-token']);
