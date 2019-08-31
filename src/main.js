const { Receiver } = require('./model/messaging/receiver.messaging')
const { AnyMapper } = require('./model/messaging/mapper.messaging').init()
const Debug = require('./model/debug')

const Logger = require('./model/logging/logger.logging')
const TokenHijacker = require('./model/hijack/token.hijack')
const { Client } = require('discord.js')
const Sender = require('./model/messaging/sender.messaging')
const { AutoLeveler } = require('./model/autolevel/autoleveler.autolevel')
const { AutoCatcher } = require('./model/autocatch/autocatcher.autocatch')

const client = new Client()
const sender = new Sender(client)
const autoLeveler = new AutoLeveler(client, sender)
const autoCatcher = new AutoCatcher(client, sender)
const receiver = new Receiver(client, AnyMapper)

const exposed = {
	Debug,
	AutoCatcher: autoCatcher,
	AutoLeveler: autoLeveler
}
window.PCBot = exposed

console.log('Click Me!')

TokenHijacker.disableDevToolsCheck()
const token = TokenHijacker.getToken()

client.login(token)

client.on('ready', () => {
	Logger.log('Client Ready')
	sender.setChannel('pokecord')
	Logger.log('In Chrome, select the "Pokecord Bot" frame in the top left of the console')
	Logger.log('Use PCBot to access the bot')
})

receiver.start()
receiver.on(AnyMapper.type, (msg) => console.log(msg))
