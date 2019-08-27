const { Receiver, MessageType } = require('../messaging/receiver.messaging')
const PokemonComparer = require('./compare.autocatch')
const { Const } = require('../utils')

/**
 *
 * @param {?Object} options
 */
async function init(options = {}) {
	if (!options.table) {
		// eslint-disable-next-line require-atomic-updates
		options.table = await fetch(chrome.runtime.getURL('data/hashes.json')).then((res) => res.json())
	}
	const comparer = new PokemonComparer(options.table)

	const pokecordId = options.pokecordId || Const.PokecordId

	Receiver.MessageMappers[MessageType.Encounter] = {
		identify: (msg) => {
			try {
				return msg.author.id == pokecordId && msg.embeds[0].title === '\u200c\u200cA wild pokémon has appeared!'
			} catch (_) {
				return false
			}
		},
		map: (msg) => {
			const imgUrl = msg.embeds[0].image.url
			return PokemonComparer.hashFromUrl(imgUrl, Const.ImgHash).then((hash) =>
				Promise.resolve({
					...comparer.bestMatch(hash),
					unknownHash: hash
				})
			)
		}
	}

	Receiver.MessageMappers.WrongGuess = {
		identify: (msg) => {
			try {
				return msg.author.id == pokecordId && msg.content === 'This is the wrong pokémon!'
			} catch (error) {
				return false
			}
		},
		map: () => {}
	}
}

module.exports = {
	init
}
