credentials = require('./credentials.json');
settings = require('./settings.json');
questions = require('./questions.json');
const Discord = require('discord.js');
const client = new Discord.Client();


participants = []

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot) { return; }
    if (msg.content == 'register' && msg.channel.type  == 'dm') {
	msg.reply('You have been registered!');
    }
});

client.login(credentials['bot-token']);
