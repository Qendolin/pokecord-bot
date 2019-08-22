
module.exports = class AutoLeveling {

    constructor(messaging) {
        this.messaging = messaging
    }
    /**
    * @param {int[]} pkmnIds
    */
    startAutoLevel(pkmnIds) {
        let currentPokemon = 0;
        this.messaging.sendMessage(`.select ${pkmnIds[currentPokemon]}`)
        var interval = setInterval(() => {
            if (!this.pkmIsLvl100()) {
                this.messaging.sendMessage(this.randomText())
            } else {
                currentPokemon++;
                this.messaging.sendMessage(`.select ${pkmnIds[currentPokemon]}`)
                if (currentPokemon > pkmnIds.length) this.stopAutoLevel()
            }
        }, 1000);
    }

    stopAutoLevel() {
        clearInterval(interval)
    }

    pkmIsLvl100() {
        if (this.messaging.getMessage().sender == "Pokécord" && this.messaging.getMessage().message.match(new RegExp(`Congratulations ${this.messaging.getClient().user.username}! Your (?:\w+) is now level 30!`))) {
            return true;
        }
        return false;
    }

    randomText() {
        let min = 4;
        let max = 10;
        let length =
            Math.floor(Math.random() * (max - min)) + min;
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}