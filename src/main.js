const { Receiver } = require('./model/messaging/receiver.messaging')
const { AnyMapper } = require('./model/messaging/mapper.messaging').init()
const { Const } = require('./model/utils')
const Debug = require('./model/debug')

const Logger = require('./model/logging/logger.logging')
const TokenHijacker = require('./model/hijack/token.hijack')
const { Client } = require('discord.js')
const Sender = require('./model/messaging/sender.messaging')
const { AutoLeveler } = require('./model/autolevel/autoleveler.autolevel')
const { AutoCatcher } = require('./model/autocatch/autocatcher.autocatch')
const { execInPageContext } = require('./model/unsafe/exec.unsafe')

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

client.on('ready', async () => {
	const user = await client.fetchUser(Const.PokecordId)
	if (user.presence.status !== 'online') {
		Logger.warn('Pokecord not online')
		return
	}

	Logger.log('Client Ready')
	sender.setChannel('pokecord')
	Logger.log('In Chrome, select the "Pokecord Bot" frame in the top left of the console')
	Logger.log('In Firefox use pcEval')
	Logger.log('Use PCBot to access the bot')
})

receiver.start()
receiver.on(AnyMapper.type, (msg) => console.log(msg))

window.addEventListener('EvalInContentScript', (ev) => {
	eval(ev.detail)
})

execInPageContext(() => {
	window.pcEval = (code) => {
		if (typeof code === 'function') {
			code = `(${code.toString()})()`
		}
		window.dispatchEvent(new CustomEvent('EvalInContentScript', { detail: code }))
	}
})
