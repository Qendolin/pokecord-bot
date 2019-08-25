const { Receiver, MessageType } = require('./model/messaging/receiver.messaging')
const { Client } = require('discord.js')
const TokenHijacker = new (require('./model/hijack/token.hijack'))()
require('./model/autocatch/mapper.autocatch').init()

console.log('Click Me!')

TokenHijacker.disableDevToolsCheck()
const token = TokenHijacker.getToken()

const client = new Client()
client.login(token)
client.on('ready', () => console.log('Client Ready'))
const receiver = new Receiver(client)

receiver.start()
receiver.on(MessageType.Any, (msg) => console.log(msg))
receiver.on(MessageType.Encounter, async (data) => console.log(await data))
