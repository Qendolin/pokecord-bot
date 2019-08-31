const { Receiver } = require('../messaging/receiver.messaging')
const { EncounterMapper, WrongGuessMapper, CorrectGuessMapper } = require('./mapper.autocatch').init()

class AutoCatcher {
	constructor(client, sender) {
		this._sender = sender
		this._receiver = new Receiver(client, EncounterMapper, WrongGuessMapper, CorrectGuessMapper)

		this._onEncounter = this._onEncounter.bind(this)
		this._onWrong = this._onWrong.bind(this)
		this._onCorrect = this._onCorrect.bind(this)

		this._lastGuess = null

		this.statistics = {
			correct: [],
			wrong: [],
			guesses: 0
		}

		this._receiver.on(EncounterMapper.type, this._onEncounter)
		this._receiver.on(WrongGuessMapper.type, this._onWrong)
		this._receiver.on(CorrectGuessMapper.type, this._onCorrect)
	}

	start() {
		this._receiver.start()
	}

	stop() {
		this._receiver.stop()
	}

	_onWrong() {
		this.statistics.wrong.push(this._lastGuess)
	}

	_onCorrect() {
		this.statistics.correct.push(this._lastGuess)
	}

	async _onEncounter(mapping) {
		mapping = await mapping
		this._sender.sendMessage(`.catch ${mapping.name}`)
		this.statistics.guesses++
		this._lastGuess = mapping
	}
}

module.exports = { AutoCatcher }
