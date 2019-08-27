const { Receiver, MessageType } = require('../messaging/receiver.messaging')
// eslint-disable-next-line no-unused-vars
const { Client } = require('discord.js')
module.exports = class AutoLeveling {
	/**
	 *
	 * @param {*} messaging
	 * @param {Client} client
	 */
	constructor(messaging, client) {
		this.messaging = messaging
		this.client = client
		this.receiver = new Receiver(client)
		this.receiver.on(MessageType.Selected, (mappedMessage) => {
			if (this._onSelected) {
				this._onSelected(mappedMessage)
			}
		})
		this.receiver.on(MessageType.LevelUp, (mappedMessage) => {
			if (this._onLevelUp) {
				this._onLevelUp(mappedMessage)
			}
		})
	}
	/**
	 * @param {int[]} pkmnIds
	 */
	async start(pkmnIds) {
		let pkmnIdx = 0
		this.receiver.start()

		while (pkmnIds.length > 0) {
			this.messaging.sendMessage(`.select ${pkmnIds[pkmnIdx]}`)
			const newLevel = await this._level(pkmnIds[pkmnIdx]).catch(() => {})

			if (newLevel == null) {
				return
			}
			if (newLevel == 100) {
				pkmnIds.splice(pkmnIdx, 1)
			} else {
				pkmnIdx++
			}
			// eslint-disable-next-line require-atomic-updates
			pkmnIdx %= pkmnIds.length
		}
		this.stop()
	}

	stop() {
		this.receiver.stop()
		clearInterval(this.interval)
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

		const interval = setInterval(() => {
			this.messaging.sendMessage(this._randomText())
		}, 1000)

		return new Promise((resolve) => {
			this._onLevelUp = (mappedMessage) => {
				const { level, username } = mappedMessage
				if (this.client.user.username !== username) {
					return
				}
				clearInterval(interval)
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
