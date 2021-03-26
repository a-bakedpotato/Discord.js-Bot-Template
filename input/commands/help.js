const fs = require('fs');

require('dotenv').config();

module.exports = {
	name: 'help',
	description: 'Displays a list of the commands.',
	run: async msg => {
		let commands = fs.readdirSync('./commands');
		if (commands.length <= 9) return msg.channel.send({
			embed: {
				title: 'Help for '+msg.client.user.username,
				color: 0x5555FF,
				fields: commands.map(c => {
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

		for (let i = 0; i <= commands.length; i += 6){
			pages.push({
				title: 'Help for '+msg.client.user.username,
				color: 0x5555FF,
				fields: commands.slice(i, i+6).map(c => {
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

		let emojis = ['◀', '▶'];
		if (pages.length > 5) emojis = ['⏮', '◀', '▶', '⏭'];
		if (pages.length > 10) emojis = ['⏮', '⏪', '◀', '▶', '⏩', '⏭'];

		let bMsg = await msg.channel.send({embed: pages[page]});
		let rCollect = bMsg.createReactionCollector((r, u) => emojis.includes(r.emoji.name) && u.id === msg.author.id, { time: 600000 });
		emojis.forEach(e => bMsg.react(e));

		bMsg.on('collect', r => {
			if (msg.channel.type === 'text') bMsg.reactions.resolve(r.emoji.name).users.remove(msg.author.id);
			switch (r.emoji.name){
				case '⏮':
					page = 0;
					break;
				case '⏪':
					page -= 5;
					break;
				case '◀':
					page--;
					break;
				case '▶':
					page++;
					break;
				case '⏩':
					page += 5;
					break;
				case '⏭':
					page = pages.length-1;
					break;
			}
			if (page < 0) page = 0;
			if (page >= pages.length) page = pages.length-1;
			bMsg.edit({embed: pages[page]});
		});
	}
}