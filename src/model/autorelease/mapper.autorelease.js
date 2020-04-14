const { Const } = require('../utils')

function init(options = {}) {
	const pokecordId = options.pokecordId || Const.PokecordId

	const PokemonListMapper = {
		type: 'PokemonList',
		indentify: (msg) => {
			try {
				return msg.author.id == pokecordId && msg.embeds[0].title === 'Your pokémon:'
			} catch (_) {
				return false
			}
		},
		map: (msg) => {
			const descr = msg.embeds[0].description
			const pokemon = []
			const descrRegex = /^\*\*([^*]+)\*\* \| Level: (\d{1,3}) \| Number: (\d+)(?: \| Nickname: ([\u{0000}-\u{ffff}]*))?$/u
			for (const line of descr.split('\n')) {
				const [, name, level, id, nickname] = descrRegex.exec(line)
				pokemon.push({
					name,
					level,
					id,
					nickname,
				})
			}
			const footerRegex = /^Showing (\d+)-(\d+) of (\d+) pokémon matching this search\./
			const [, from, to, of] = footerRegex.exec(msg.embeds[0].footer.text)
			return {
				showing: {
					from,
					to,
					of,
				},
				pokemon,
			}
		},
	}

	return { PokemonListMapper }
}

module.exports = { init }
