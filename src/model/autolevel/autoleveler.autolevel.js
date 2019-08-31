const { Receiver } = require('../messaging/receiver.messaging')
const { LevelUpMapper, SelectedMapper } = require('./mapper.auto-leveling').init()
// eslint-disable-next-line no-unused-vars
const { Client } = require('discord.js')
class AutoLeveler {
	/**
	 * @param {Client} client
	 * @param {*} sender
	 */
	constructor(client, sender) {
		this._sender = sender
		this._client = client
		this._receiver = new Receiver(client, LevelUpMapper, SelectedMapper)
		this._receiver.on(SelectedMapper.type, (mappedMessage) => {
			if (this._onSelected) {
				this._onSelected(mappedMessage)
			}
		})
		this._receiver.on(LevelUpMapper.type, (mappedMessage) => {
			if (this._onLevelUp) {
				this._onLevelUp(mappedMessage)
			}
		})
		this._started
	}
	/**
	 * @param {int[]} pkmnIds
	 */
	async start(pkmnIds) {
		let pkmnIdx = 0
		this._receiver.start()

		while (pkmnIds.length > 0) {
			this._sender.send(`.select ${pkmnIds[pkmnIdx]}`)
			const newLevel = await this._level(pkmnIds[pkmnIdx]).catch(() => {})

			if (newLevel == null) {
				return
			}
			if (newLevel == 100) {
				pkmnIds.splice(pkmnIdx, 1)
			} else {
				pkmnIdx++
			}
			pkmnIdx %= pkmnIds.length
		}
		this.stop()
	}

	stop() {
		this._receiver.stop()
		clearInterval(this._interval)
	}

	async _level(pkmnId) {
		let isLevel100 = await new Promise((resolve) => {
			this._onSelected = (mappedMessage) => {
				const { level, pokemonId: receivedPkmnId } = mappedMessage
				if (pkmnId != receivedPkmnId) {
					return
				}

				if (level == 100) {
					return resolve(true)
				}

				resolve(false)
			}
			setTimeout(() => {
				resolve(null)
			}, 5000)
		})
		this._onSelected = null
		if (isLevel100 === null) {
			return Promise.reject()
		}

		if (isLevel100 === true) {
			return Promise.resolve(100)
		}

		this._interval = setInterval(() => {
			this._sender.send(this._randomText())
		}, 1000)

		return new Promise((resolve) => {
			this._onLevelUp = (mappedMessage) => {
				const { level, username } = mappedMessage
				if (this._client.user.username !== username) {
					return
				}
				clearInterval(this._interval)
				this._onLevelUp = null
				resolve(level)
			}
		})
	}

	_randomText() {
		let length = 10
		let result = ''
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}
}

module.exports = { AutoLeveler }
