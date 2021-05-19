credentials = require('./credentials.json');
settings = require('./settings.json');
questions = require('./questions.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

let active_reactions = [];
participants = {};
//let current_question;

/*
client.on('messageReactionAdd', async (new_reaction, user) => {
    if (user.bot) { return; }

    choice_index = active_reactions.findIndex(reaction => new_reaction == reaction);

    if(!choice_index) {
        return;
    }

    if (!(user.id in participants)) {
        participants[user.id] = {}
    }

    participants[user.id][current_question.question] = choice_index;
});*/

    //console.log(active_reactions);

/*
    if (reaction in active_reactions) {
	        quiz_channel = msg.guild.channels.cache.get(
		        settings['quiz-channel-id']
	        );
        quiz_channel.send('the bot has detected your reaction');
    }*/



client.on('message', async msg => {
    if (msg.author.bot) { return; }

    if (msg.content == 'hi') { msg.reply('hello'); }

    if (msg.content.startsWith('!admin') && 
	    settings['admin-ids'].includes(msg.author.id)) {

	    admin_cmd = msg.content.substring('!admin'.length).trim();

        add_reaction =  async (msg, how_many, active_reactions) => {
            for (let i = 0; i < how_many; ++i) {
                reaction = await msg.react(settings['option-emojis'][i]);
                active_reactions.push(reaction);         
            }
        }
       
	    if (admin_cmd == 'start quiz') {

            time_per_question = 5;
            time_for_start = 5;

	        quiz_channel = msg.guild.channels.cache.get(
		        settings['quiz-channel-id']
	        );
	        msg = await quiz_channel.send('starting quiz..');
            for (let i = time_for_start; i >= 0; --i) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                msg = await msg.edit(`Quiz starting in ${i}s`)
            }
            await msg.delete();

            for (const [index, question] of questions.entries()) {

                //current_question = question;
                question_prompt = '';

                question_prompt += '**Question (' + (index+1).toString() + '):** '
                question_prompt += question.question;
                question_prompt += '\n';
                question.options.forEach((option, index) => {
                    question_prompt += '(' + settings['option-emojis'][index] + ') ' + option + '\n'
                });

                msg = await quiz_channel.send(question_prompt);
                setTimeout(add_reaction, 0, msg, question.options.length, active_reactions);

                for (let i = time_per_question; i >= 0; --i) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await msg.edit(
                        question_prompt + '\n'
                        + `**time left: ${i}**`
                    );
                }
                active_reactions.forEach((reaction, reaction_index) => () {
                    reaction.users.cache.each(user => {
                        if (!(user.id in participants)) {
                            participants[user.id] = { answers : [] };
                        }
                        if (participants[user.id][index] == undefined) {
                            participants[user.id][index] = reaction_index;
                        }
                        else {

                        }
                    });
                });


/*
                for (const [index, item] of active_reactions.entries()) {
                    console.log(index);
                    item.users.cache.each( user => {
                        console.log(user.id);
                    });
                }*/
                await msg.delete();
                active_reactions = []            
            }
            //current_question = null;
            quiz_channel.send('processing');

           // console.log(participants);


        }
    }
});

client.login(credentials['bot-token']);

/*
            msg = await quiz_channel.send(`First Question: ${questions[0].question}`)
            setTimeout(add_reaction, 0, msg, 4);
            for (let i = 4; i >= 0; --i) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await msg.edit(
                    `First Question: ${questions[0].question}\n`
                    +  `time left: ${i}s`
                );
            }
            msg.delete();
            quiz_channel.send('processing..');
*/




/*

msg.react(settings['option-emojis'][0]).then(reaction1 => {
                    msg.react(settings['option-emojis'][1]);              
                })


	    quiz_channel.send(`First Question: ${questions[0].question}`).then(msg => {
		    msg.react(settings['option-emojis'][0]).then(msg => {
		        msg.react(settings['option-emojis'][1]);
		    });
	    });
	}


	    countdown = (msg, count) => {
		    if (!count) { 
		        msg.channel.send('Quiz started!');
		        return;
		    }
		    msg.edit(`Quiz starting in ${count}s`).then(()=> {
			    setTimeout(countdown, 1000, msg, count-1);
		    });
	    }
*/
