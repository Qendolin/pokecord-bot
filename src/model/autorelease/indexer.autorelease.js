const { Receiver } = require('../messaging/receiver.messaging')
const { PokemonListMapper } = require('./mapper.autorelease').init()

class Indexer {
	constructor(client, sender) {
		this._started = false
		this._receiver = new Receiver(client, PokemonListMapper)
		this._sender = sender

		this._onPokemonList = this._onPokemonList.bind(this)

		this._receiver.on(PokemonListMapper.type, this._onPokemonList)
	}

	start() {
		this._index = []
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

	get() {}

	async _indexAll() {
		let max = this._index.length + 1
		for (let page = 1; this._index.length < max; page++) {
			this._sender.sendMessage(`.pokemon ${page}`)
			const mapping = await new Promise((resolve) => {
				this._onPokemonList = (res) => {
					resolve(res)
				}
				setTimeout(() => {
					resolve()
				}, 5000)
			})
			if (!mapping) {
				continue
			}

			max = mapping.showing.to
			this._index.push(...mapping.pokemon)
		}
	}
}

module.exports = Indexer
