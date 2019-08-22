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
module.exports = class Messaging {

    constructor() {
        client.on('message', message => {
            if (message.author.username === "Pokécord") {
                sender = message.author.username
                senderMessage = message.embeds[0].fields

                console.log(this.getMessage())
            }
        })
        client.on('ready', () => {
            Logger.log('Pokecord Bot v.α by Qendolin and LetsCyb successfully initialized')
            if (getDefaultChannel()) {
                getDefaultChannel().send('Pokecord Bot v.α by Qendolin and LetsCyb successfully initialized')
            }
        })
    }

    resetSender() {
        sender = ""
    }

    getClient() {
        return client
    }

    enableMessaging() {
        Logger.log('disabling dev tools check')
        TokenHijacker.disableDevToolsCheck()
        const token = TokenHijacker.getToken()
        if (token == null) {
            Logger.error('Token is null')
        }
        client.login(token)
    }

    channelReady() {
        if (getDefaultChannel())
            return true
        return false
    }

    sendMessage(message) {
        if (getDefaultChannel()) {
            getDefaultChannel().send(message)
        } else {
            Logger.error('Channel is null')
        }
    }

    getMessage() {
        return { sender: sender, message: senderMessage }
    }
}

