const autolvling = new (require('./model/auto-leveling/auto-leveling'))(sender)
const TokenHijacker = new (require('../src/model/hijack/token.hijack'))()
const Logger = new (require('../logging/logger.logging'))()
const { Client } = require('discord.js')
const client = new Client()
const sender = new (require('./model/messaging/sender.messaging'))(client)

main()

function main() {
	loginClient()
	client.on('ready', () => {
		autolvling.startAutoLevel([100, 110])
	})
}

function loginClient() {
	Logger.log('disabling dev tools check')
	TokenHijacker.disableDevToolsCheck()
	const token = TokenHijacker.getToken()
	if (token == null) {
		Logger.error('Token is null')
	}
	client.login(token)
}
