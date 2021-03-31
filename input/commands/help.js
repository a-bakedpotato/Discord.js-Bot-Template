const fs = require('fs');
const PagedEmbed = require('../util/PagedEmbed.js');

require('dotenv').config();

module.exports = {
	name: 'help',
	description: 'Displays a list of the commands.',
	run: async msg => {
		let pageSize = 6; // Must be below 25, I'd recommend 6, 9, or 12
		
		let commands = fs.readdirSync('./commands');
		if (pageSize > 25) pageSize = 25;
		if (commands.length <= (pageSize + 3 - (pageSize % 3))) return msg.channel.send({
			embed: {
				title: 'Help for '+msg.client.user.username,
				color: 0x5555FF,
				fields: commands.slice(0, 24).map(c => {
					let cmd = require('./'+c);
					return {
						name: process.env.prefix+cmd.name,
						value: cmd.description+((cmd.aliases) ? '\n***Aliases:** '+cmd.aliases.join(', ')+'*':''),
						inline: true
					}
				}),
				footer: {
					text: 'Discord Bot Template by a.bakedpotato'
				}
			}
		});

		let pages = [];
		let page = 0;

		for (let i = 0; i <= commands.length; i += pageSize){
			pages.push({
				title: 'Help for '+msg.client.user.username,
				color: 0x5555FF,
				fields: commands.slice(i, i+pageSize).map(c => {
					let cmd = require('./'+c);
					return {
						name: process.env.prefix+cmd.name,
						value: cmd.description+((cmd.aliases) ? '\n***Aliases:** '+cmd.aliases.join(', ')+'*':''),
						inline: true
					}
				}),
				footer: {
					text: 'Page '+(pages.length+1)
				}
			});
		}
		pages.forEach(p => p.footer.text += ' of '+pages.length);

		new PagedEmbed(msg, pages);
	}
}