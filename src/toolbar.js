const { Scrape } = require('./model/autocatch/scrape/scraper.scrape')

chrome.browserAction.onClicked.addListener(async () => {
	const data = await Scrape()
	console.log(JSON.stringify(data, null, 2))
})
