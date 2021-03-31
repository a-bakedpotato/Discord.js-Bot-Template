class PagedEmbed {
	constructor(msg, pages){
		(async () => {
			let page = 0;
			let bMsg = await msg.channel.send({embed: pages[page]});
			
			let emojis = ['◀', '▶'];
			if (pages.length >= 5) emojis = ['⏮', '◀', '▶', '⏭'];
			if (pages.length >= 10) emojis = ['⏮', '⏪', '◀', '▶', '⏩', '⏭'];
			emojis.forEach(e => bMsg.react(e));

			let rCollect = bMsg.createReactionCollector((r, u) => emojis.includes(r.emoji.name) && u.id === msg.author.id, {time: 600000});
			rCollect.on('collect', (r, u) => {
				bMsg.reactions.resolve(r.emoji.name).remove(u.id);

				let values = {
					'⏮':	-1*pages.length,
					'⏪':	-5,
					'◀':	-1,
					'▶':	1,
					'⏩':	5,
					'⏭':	pages.length,
				}
				page += values[r.emoji.name];

				if (page < 0) page = 0;
				if (page >= pages.length) page = pages.length-1;

				bMsg.edit({embed: pages[page]});
			});
			rCollect.on('end', () => bMsg.reactions.removeAll());
		})();
	}
}

module.exports = PagedEmbed;