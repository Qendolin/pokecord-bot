const autolvling = new (require('./model/auto-leveling/auto-leveling'))()

main()

function main() {
    autolvling.autoLevel([100, 110])
}