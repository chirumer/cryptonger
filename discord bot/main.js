credentials = require('./credentials.json');
settings = require('./settings.json');
questions = require('./questions.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot) { return; }

    if (msg.content == 'hi') { msg.reply('hello'); }

    if (msg.content.startsWith('!admin') && 
	    settings['admin-ids'].includes(msg.author.id)) {

	admin_cmd = msg.content.substring('!admin'.length).trim();
   
	if (admin_cmd == 'start quiz') {
	    quiz_channel = msg.guild.channels.cache.get(
		settings['quiz-channel-id']
	    );
	    countdown = (msg, count) => {
		    if (!count) { 
		        msg.channel.send('Quiz started!');
		        return;
		    }
		    msg.edit(`Quiz starting in ${count}s`).then(()=> {
			setTimeout(countdown, 1000, msg, count-1);
		    });
	    }
	    quiz_channel.send('starting quiz..').then(msg => {
		setTimeout(countdown, 1000, msg, 20);
	    });
	    quiz_channel.send(`First Question: ${questions[0].question}`).then(msg => {
		    msg.react(settings['option-emojis'][0]).then(msg => {
		        msg.react(settings['option-emojis'][1]);
		    });
	    });
	}

    }
});

client.login(credentials['bot-token']);
