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
	AutoLeveler: autoLeveler,
	help: () => {
		Logger.log(`
	- Auto Catching
	  
		Start
		 Type PCBot.AutoCatcher.start() to start automatically catching all Pokémon.
		
		Stop
		 Type PCBot.AutoCatcher.stop() to stop catching Pokémon.
		
		Statistics
		 Type PCBot.AutoCatcher.statistics to view the statistics.

	- Auto Leveling

		Start
		 Type PCBot.AutoLeveler.start( pokemonIds ) and provide an array of pokemon ids (the numbers from p!pokemon) as pokemonIds to start leveling those pokemon.

		Stop
		 Type PCBot.AutoLeveler.stop() to stop leveling.
	`)
	},
}
window.PCBot = exposed

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
	let channelSuccess = false
	let channelName = 'pokecord'
	Logger.log('Text channels: ')
	Logger.log(
		client.channels
			.filter((ch) => ch.type === 'text' && ch.permissionsFor(client.user).has('SEND_MESSAGES'))
			.reduce((acc, ch) => {
				return `${acc}${ch.name}\n`
			}, '\n')
	)
	while (!channelSuccess) {
		try {
			Logger.log(`Setting channel to "${channelName}"`)
			sender.setChannel(channelName)
			channelSuccess = true
		} catch (err) {
			Logger.warn(err)
			channelName = prompt('What is the name of the pokecord channel?')
			if (!channelName) {
				Logger.log('Empty name supplied, stopping')
				return
			}
			channelName = channelName.toLowerCase()
		}
	}
	Logger.log('In Chrome, select the "Pokecord Bot" frame in the top left of the console')
	Logger.log('In Firefox use pcEval')
	Logger.log('Use PCBot to access the bot')
	Logger.log('Use PCBot.help() to view the help')
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
