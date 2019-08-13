
const tokenHijacker = require('../hijack/Token.hijack')
const TokenHijacker = new tokenHijacker()
const Discord = require('discord.js')
const client = new Discord.Client()

const getDefaultChannel = () => {

    let pokecordchannels = client.channels.filter(channel => channel.name == "pokecord")

    return pokecordchannels
        .filter(c => c.type === "text" &&
            c.permissionsFor(client.user).has("SEND_MESSAGES"))
        .first();
}

client.on('ready', () => {
    if (getDefaultChannel())
        getDefaultChannel().send("HELLO IM BOT")
})


TokenHijacker.restoreLocalStorage()
TokenHijacker.disableDevToolsCheck()
client.login(TokenHijacker.getToken())


