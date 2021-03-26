function clean(text){
	if (typeof text === 'string') return text.replace(/`/g, '`'+String.fromCharCode(8203)).replace(/@/g, '@'+String.fromCharCode(8203));
	return text;
}

module.exports = {
	name: 'eval',
	description: 'Execute code.',
	run: async (msg, args) => {
		let app = await msg.client.fetchApplication();
		if (msg.author.id !== app.owner.id) return msg.reply('You do not have access to this command!');
		try {
			let evaled = eval(args.join(' '));
			if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
			msg.channel.send(clean(evaled), {code:'xl'});
		} catch(err){
			msg.channel.send('`ERROR````xl\n'+clean(err)+'\n```');
		}
	}
}