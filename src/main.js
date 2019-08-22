const autolvling = new (require('./model/auto-leveling/auto-leveling'))()
const messaging = new (require('./model/messaging/sender.messaging'))()

main()

function main() {
    messaging.enableMessaging()
    autolvling.autoLevel([100, 110])
}