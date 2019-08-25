const autolvling = new (require('./model/auto-leveling/auto-leveling'))(sender)
const TokenHijacker = new (require('../src/model/hijack/token.hijack'))()
const Logger = new (require('../logging/logger.logging'))()
const { Client } = require('discord.js')
const sender = new (require('./model/messaging/sender.messaging'))(client)

const { Receiver, MessageType } = require('./model/messaging/receiver.messaging')

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

function main() {}

main()
