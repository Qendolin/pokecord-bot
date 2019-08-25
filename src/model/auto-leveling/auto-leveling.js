module.exports = class AutoLeveling {
	constructor(messaging) {
		this.messaging = messaging
	}
	/**
	 * @param {int[]} pkmnIds
	 */
	start(pkmnIds) {
		let pkmn = 0
		this.messaging.sendMessage(`.select ${pkmnIds[pkmn]}`)
		this.interval = setInterval(async () => {
			await this._level(pkmnIds[pkmn])
			pkmn++
		}, 1500)
	}

	stop() {
		clearInterval(this.interval)
	}

	async _level() {}

	_loop() {}

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
