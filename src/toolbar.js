const { getPokemon, calcHashes, calcImgs } = require('./model/autocatch/scrape/scraper.scrape')

window.Debug = require('./model/debug')

chrome.browserAction.onClicked.addListener(async () => {
	console.log('call calcImgs or calcHashes')
})

window.calcHashes = async () => {
	const data = await calcHashes(await getPokemon())
	console.log(JSON.stringify(data, null, 2))
}

window.calcImgs = async () => {
	const data = await calcImgs(await getPokemon())
	console.log(JSON.stringify(data, null, 2))
}
