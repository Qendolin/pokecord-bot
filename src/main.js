/*
const { Receiver } = require('./model/messaging/receiver.messaging')
const { AnyMapper } = require('./model/messaging/mapper.messaging').init()
const { Client } = require('discord.js')
const TokenHijacker = new (require('./model/hijack/token.hijack'))()
const { EncounterMapper, WrongGuessMapper } = require('./model/autocatch/mapper.autocatch').init({
	debug: true
})

window.Debug = require('./model/debug')
*/
const TokenHijacker = new (require('../src/model/hijack/token.hijack'))()
const { Client } = require('discord.js')
const client = new Client()
const sender = new (require('./model/messaging/sender.messaging'))(client)
const autolvling = new (require('./model/auto-leveling/auto-leveling'))(sender, client)
require('./model/auto-leveling/mapper.auto-leveling').init()


console.log('Click Me!')

TokenHijacker.disableDevToolsCheck()
const token = TokenHijacker.getToken()

/*
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
const receiver = new Receiver(client, EncounterMapper, WrongGuessMapper, AnyMapper)

//Debug
let guesses = 0
let wrong = 0
let lastGuess
window.wrongGuesses = []

receiver.start()
receiver.on(AnyMapper.type, (msg) => console.log(msg))
receiver.on(EncounterMapper.type, async (data, org) => {
	data = await data
	console.log(data)
	pokecordChannel.send(`.catch ${data.name}`)
	guesses++
	lastGuess = {
		org,
		data
	}
	console.log(guesses, wrong)
})

receiver.on('WrongGuess', () => {
	wrong++
	window.wrongGuesses.push(lastGuess)
	console.log(guesses, wrong)
})
*/
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