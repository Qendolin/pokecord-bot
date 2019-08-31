const { Const } = require('../utils')

function init(options = {}) {
	const pokecordId = options.pokecordId || Const.PokecordId

	const LevelUpMapper = {
		type: 'LevelUp',
		identify: (msg) => {
			const titleRegex = /^Congratulations .*!$/
			const descrRegex = /^Your [\u{0000}-\u{FFFF}]+ is now level \d{1,3}!$/u
			try {
				return (
					msg.author.id == pokecordId &&
					msg.embeds[0].title.match(titleRegex) &&
					msg.embeds[0].description.match(descrRegex)
				)
			} catch (_) {
				return false
			}
		},
		map: (msg) => {
			const titleRegex = /^Congratulations (.*)!$/
			const descrRegex = /^Your ([\u{0000}-\u{FFFF}]+) is now level (\d{1,3})!$/u
			const username = titleRegex.exec(msg.embeds[0].title)[1]
			const [, pokemon, level] = descrRegex.exec(msg.embeds[0].description)
			return {
				pokemon,
				level,
				username
			}
		}
	}
	const AnyMapper = {
		type: 'Any',
		identify: (msg) => msg.author.id == pokecordId,
		map: (msg) => msg
	}

	return {
		LevelUpMapper,
		AnyMapper
	}
}

module.exports = {
	init
}
