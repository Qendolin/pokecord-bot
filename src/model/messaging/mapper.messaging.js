const { Const } = require('../utils')

function init(options = {}) {
	const pokecordId = options.pokecordId || Const.PokecordId
	const AnyMapper = {
		type: 'Any',
		identify: (msg) => msg.author.id == pokecordId,
		map: (msg) => msg,
	}

	return {
		AnyMapper,
	}
}

module.exports = {
	init,
}
