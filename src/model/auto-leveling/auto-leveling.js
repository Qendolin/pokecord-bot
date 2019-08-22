
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
        this.interval = setInterval(() => {
            if (!this.pkmIsLvl100()) {
                this.messaging.sendMessage(this.randomText())
            } else {
                currentPokemon++;
                this.messaging.sendMessage(`.select ${pkmnIds[currentPokemon]}`)
                if (currentPokemon > pkmnIds.length) this.stopAutoLevel()
            }
        }, 1500);
    }

    stopAutoLevel() {
        clearInterval(this.interval)
    }

    pkmIsLvl100() {
        const actualMessage = this.messaging.getMessage()
        let pokemonName = this.getPokemonName(actualMessage.message.description, 2)
        console.log("Selected Pokemon : " + pokemonName)
        if (actualMessage.sender === "Pokécord" &&
            actualMessage.message.title === `Congratulations ${this.messaging.getClient().user.username}!` &&
            actualMessage.message.description === `Your ${pokemonName} is now level 100!`) {
            this.messaging.resetSender()
            return true;
        }
        return false;
    }

    getPokemonName(str, wordIndex) {
        let e = str.match('^(?:.+?[\\s.,;]+){' + (wordIndex - 1) + '}([^\\s.,;]+)');
        return e && e[1];
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