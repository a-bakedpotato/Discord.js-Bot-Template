module.exports = {
	name: 'example',
	description: 'An example command.',
	aliases: ['test'], //Optional
	args: [ //Only used when registering a slash command. To update, remove the command name from /data/registeredCommands.json
		{
			name: 'Arg',
			description: 'An example argument.',
			type: 3, //Types at https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
			required: false,
			choices: [ //Optional
				{
					name: 'Choice 1',
					value: 1
				},
				{
					name: 'Choice 2',
					value: 2
				}
			]
		}
	],
	run: (msg, args) => {
		msg.channel.send('I have recieved these args: `'+args.join(', ')+'`');
	},
	runSlash: (interaction, client) => { //Optional
		const respond = require('./functions/slashRespond.js');
		interaction.respond(4, 'I have recieved your message.'); //Types at https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionresponsetype
	}
}