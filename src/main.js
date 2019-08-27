const TokenHijacker = new (require('../src/model/hijack/token.hijack'))()
const { Client } = require('discord.js')
const client = new Client()
const sender = new (require('./model/messaging/sender.messaging'))(client)
const autolvling = new (require('./model/auto-leveling/auto-leveling'))(sender, client)
require('./model/auto-leveling/mapper.auto-leveling').init()

console.log('Click Me!')

TokenHijacker.disableDevToolsCheck()
const token = TokenHijacker.getToken()

client.login(token)
client.on('ready', () => console.log('Client Ready'))

function main() {
	client.on('ready', () => {
		console.log('LUUUUUUUUUUUUUL')
		sender.setChannel('pokecord')
		autolvling.start([495, 458])
	})
}

main()
