const PokemonComparer = require('./compare.autocatch')
const { Const } = require('../utils')

/**
 *
 * @param {?Object} options
 */
function init(options = {}) {
	const { table = require('../../data/hashes'), debug = false } = options
	const comparer = new PokemonComparer(table)

	const pokecordId = options.pokecordId || Const.PokecordId

	const EncounterMapper = {
		type: 'Encounter',
		identify: (msg) => {
			try {
				return msg.author.id == pokecordId && msg.embeds[0].title === '\u200c\u200cA wild pokémon has appeared!'
			} catch (_) {
				return false
			}
		},
		map: (msg) => {
			const imgUrl = msg.embeds[0].image.url
			return PokemonComparer.hashFromUrl(imgUrl, Const.ImgHash.Method, { debug }).then((res) =>
				Promise.resolve({
					...comparer.bestMatch(res.hash),
					unknownHash: res.hash,
					debug: res.debug
				})
			)
		}
	}

	const WrongGuessMapper = {
		type: 'WrongGuess',
		identify: (msg) => {
			try {
				return msg.author.id == pokecordId && msg.content === 'This is the wrong pokémon!'
			} catch (error) {
				return false
			}
		},
		map: () => {}
	}

	return {
		EncounterMapper,
		WrongGuessMapper
	}
}

module.exports = {
	init
}
