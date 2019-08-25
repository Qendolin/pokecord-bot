module.exports = class Sender {
	constructor(client) {
		this.client = client
	}

	setChannel(channelName) {
		let pokecordChannels = this.client.channels.filter(channel => channel.name == channelName)
		let pkcChannel = pokecordChannels
			.filter(c => c.type === 'text' && c.permissionsFor(this.client.user).has('SEND_MESSAGES'))
			.first()

		if (!pkcChannel) {
			throw new Error('Channel cannot be set')
		}

		this.channel = pkcChannel
	}

	sendMessage(message) {
		this.channel.send(message)
	}
}
