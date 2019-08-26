const { getPokemon, calcHashes, calcImgs } = require('./model/autocatch/scrape/scraper.scrape')

chrome.browserAction.onClicked.addListener(async () => {
	const data = await calcHashes(await getPokemon())
	console.log(JSON.stringify(data, null, 2))
})
