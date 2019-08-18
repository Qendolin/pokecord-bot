
const messaging = require('../messaging/sender.messaging')

module.exports = class AutoLeveling {

    /**
    * @param {int[]} pkmnIds
    */
    startAutoLevel(pkmnIds) {
        let currentPokemon = 0;
        messaging.sendMessage(`.select ${pkmnIds[currentPokemon]}`)
        var interval = setInterval(() => {
            if (!this.pkmIsLvl100()) {
                messaging.sendMessage(this.randomText())
            } else {
                currentPokemon++;
                messaging.sendMessage(`.select ${pkmnIds[currentPokemon]}`)
                if (currentPokemon > pkmnIds.length) this.stopAutoLevel()
            }
        }, 1000);
    }

    stopAutoLevel() {
        clearInterval(interval)
    }

    pkmIsLvl100() {
        if (messaging.getMessage().sender == "Pokécord" && messaging.getMessage().message.match(new RegExp(`Congratulations ${messaging.client.user.username}! Your (?:\w+) is now level 100!`))) {
            return true;
        }
        return false;
    }

    randomText() {
        let min = 4;
        let max = 10;
        let length =
            Math.floor(Math.random() * (max - min)) + emin;
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}