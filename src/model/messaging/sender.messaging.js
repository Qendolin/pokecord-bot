module.exports = class Sender {
	constructor(client) {
		this.client = client
		this._toBeSent = []
		setInterval(this._sendOne.bind(this), 1100)
	}

	setChannel(channelName) {
		let pokecordChannels = this.client.channels.filter(
			(channel) => channel.name != null && channel.name.toLowerCase() == channelName.toLowerCase()
		)
		let pkcChannel = pokecordChannels
			.filter((c) => c.type === 'text' && c.permissionsFor(this.client.user).has('SEND_MESSAGES'))
			.first()

		if (!pkcChannel) {
			throw new Error('Failed to set channel. Make sure you have write permission.')
		}

		this.channel = pkcChannel
	}

	send(message) {
		//this._toBeSent.push(message)
		this.sendNow(message)
	}

	sendNow(message) {
		this.channel.send(message)
	}

	_sendOne() {
		const msg = this._toBeSent.pop()
		if (msg) {
			this.channel.send(msg)
		}
	}
}
