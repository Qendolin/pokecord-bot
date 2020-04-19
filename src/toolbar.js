const { calcHashes, calcImgs } = require('./model/autocatch/scrape/scraper.scrape')

window.Debug = require('./model/debug')

chrome.browserAction.onClicked.addListener(async () => {
	console.log(`
		Call calcImgs to get a base64 representation of all the images that will be used to calculate the hashes. (Mainly used for debugging purposes)

		Call calcHashes to calculate all hashes of the images. The result should be stored in /src/data/hashes.js. Use this if the images used by bulbagarden have changed.

		WARNING: This makes a lot of requests and may take a few minutes.
	`)
})

window.calcHashes = async () => {
	const data = await calcHashes()
	console.log(JSON.stringify(data, null, 2))
}

window.calcImgs = async () => {
	const data = await calcImgs()
	console.log(JSON.stringify(data, null, 2))
}
