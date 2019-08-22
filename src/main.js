const messaging = new (require('./model/messaging/sender.messaging'))()
const autolvling = new (require('./model/auto-leveling/auto-leveling'))(messaging)


main()

function main() {
    messaging.enableMessaging()
    //messaging.getClient().on('ready', () => {
    //    autolvling.startAutoLevel([100, 110])
    //})

}