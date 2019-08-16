const tokenHijacker = require('../hijack/Token.hijack')
const TokenHijacker = new tokenHijacker()
const Discord = require('discord.js')
const client = new Discord.Client()

const getDefaultChannel = () => {
    let pokecordchannels = client.channels.filter(channel => channel.name == 'pokecord')

    return pokecordchannels.filter(c => c.type === 'text' && c.permissionsFor(client.user).has('SEND_MESSAGES')).first()
}

client.on('ready', () => {
    console.log('client ready')
    if (getDefaultChannel()) getDefaultChannel().send('HELLO IM BOT')
})

window.addEventListener('load', () => {
    TokenHijacker.restoreLocalStorage()
    TokenHijacker.disableDevToolsCheck()
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const token = TokenHijacker.getToken()
            if (token == null) {
                console.error('Token is null')
                return
            }
            client
                .login(token)
                .then(console.log)
                .catch(console.error)
        })
    })
})

chrome.runtime.onMessage.addListener(msg => {
    console.log(msg)
    getDefaultChannel().send(msg.test)
})
