const {Receiver} = require('../messaging/receiver.messaging')
const {PokemonListMapper} = require('./mapper.autorelease').init()

class Indexer {
	constructor(client, sender) {
		this._started = false
		this._receiver = new Receiver(client, PokemonListMapper)
		this._sender = sender

		this._onPokemonList = this._onPokemonList.bind(this)

		this._receiver.on(PokemonListMapper.type, this._onPokemonList)
		this._index = []
	}

	start() {
		if (this._started) {
			return
		}
		this._started = true
		this._receiver.start()
	}

	stop() {
		if (!this._started) {
			return
		}
		this._started = false
		this._receiver.stop()
	}

	get() {

	}

	_onPokemonList(mapping) {
		this._index.push(...mapping.pokemon)
		if(this.index)
	}
}
