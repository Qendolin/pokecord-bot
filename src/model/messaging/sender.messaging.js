const TokenHijacker = new (require('../hijack/token.hijack'))()
const Discord = require('discord.js')
const client = new Discord.Client()
const Logger = new (require('../logging/logger.logging'))()
var sender = "";
var senderMessage = "";

const getDefaultChannel = () => {
    let pokecordchannels = client.channels.filter(channel => channel.name == 'pokecord')

    return pokecordchannels.filter(c => c.type === 'text' && c.permissionsFor(client.user).has('SEND_MESSAGES')).first()
}

client.on('ready', () => {
    Logger.log('Pokecord Bot v.α by Qendolin and LetsCyb successfully initialized')
    if (getDefaultChannel())
        getDefaultChannel().send('Pokecord Bot v.α by Qendolin and LetsCyb successfully initialized')
})

messaging.client.on('message', message => {
    if (message.channel == getDefaultChannel()) {
        sender = message.author.username;
        senderMessage = message.content;
    }
})

function enableMessaging() {
    Logger.log('disabling dev tools check')
    TokenHijacker.disableDevToolsCheck()
    const token = TokenHijacker.getToken()
    if (token == null) {
        Logger.error('Token is null')
        return
    }
    client.login(token).catch(Logger.error)

    chrome.runtime.onMessage.addListener(msg => {
        Logger.debug(msg)
        getDefaultChannel().send(msg.test)
    })
}

function sendMessage(message) {
    if (getDefaultChannel()) {
        getDefaultChannel().send(message)
    } else {
        Logger.error('Channel is null')
    }
}

function getMessage() {
    return { sender: sender, message: senderMessage }
}
