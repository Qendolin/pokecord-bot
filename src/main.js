const { Receiver, MessageType } = require('./model/messaging/receiver.messaging')
const { Client } = require('discord.js')
const TokenHijacker = new (require('./model/hijack/token.hijack'))()
require('./model/autocatch/mapper.autocatch').init()

console.log('Click Me!')

TokenHijacker.disableDevToolsCheck()
const token = TokenHijacker.getToken()

let pokecordChannel
const client = new Client()
client.login(token)
client.on('ready', () => {
	console.log('Client Ready')
	const pokecordChannels = client.channels.filter((channel) => channel.name == 'pokecord')
	pokecordChannel = pokecordChannels
		.filter((c) => c.type === 'text' && c.permissionsFor(client.user).has('SEND_MESSAGES'))
		.first()
	setInterval(() => {
		pokecordChannel.send('karakai jouzu no takagi-san :100: :fire: :fire: :fire:')
	}, 1200)
})
const receiver = new Receiver(client)

let guesses = 0
let wrong = 0

receiver.start()
receiver.on(MessageType.Any, (msg) => console.log(msg))
receiver.on(MessageType.Encounter, async (data) => {
	data = await data
	console.log(data)
	pokecordChannel.send(`.catch ${data.name}`)
	guesses++
	console.log(guesses, wrong)
})

receiver.on('WrongGuess', () => {
	wrong++
	console.log(guesses, wrong)
})
