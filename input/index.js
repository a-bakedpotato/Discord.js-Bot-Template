//Template made by a.bakedpotato
const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const fs = require('fs');

require('dotenv').config();

let commands = {};

client.on('ready', async () => {
	console.log(`${client.user.tag} is online!`);
	let cmds = JSON.parse(fs.readFileSync('./data/registeredCommands.json'));
	for (const command of fs.readdirSync('./commands')){
		let cmd = require('./commands/'+command);
		commands[cmd.name] = cmd;
		console.log('Registered command: '+cmd.name);
		if (command.aliases){
			for (const alias of command.aliases){
				commands[alias] = cmd;
				console.log('Registered command alias: '+alias);
			}
		}

		if (command.runSlash && !cmds.includes(cmd.name)){
			cmds.push(cmd.name);
			let slashCommand = await axios.post('https://discord.com/api/v8/applications/'+client.user.id+'/commands',
				{
					name: cmd.name,
					description: cmd.description,
					options: args || []
				},
				{
					headers: {
						'Authorization': 'Bot '+client.token
					}
				}
			).catch(console.log);
			if (slashCommand.data.id){
				console.log('Successfully registered command: /'+cmd.name)
			}
		}
	}
	fs.writeFileSync('./data/registeredCommands.json', JSON.stringify(cmds, null, 4));
});

client.on('message', msg => {
	let prefix = process.env.prefix;
	if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
	let args = msg.content.substr(prefix.length).split(/\s+/g);
	let cmd = args.shift();
	if (!commands[cmd]) return;
	commands[cmd].run(msg, args);
});

client.ws.on('INTERACTION_CREATE', interaction => {
	if (!commands[interaction.data.name]) return;
	interaction.respond = (type, response) => {
		if (typeof response === 'string') response = {content: response};
		axios.post('https://discord.com/api/v8/interactions/'+interaction.id+'/'+interaction.token+'/callback', {
			type: type,
			data: response
		});
	}
	commands[interaction.data.name].runSlash(interaction, bot);
});

client.login(process.env.token);