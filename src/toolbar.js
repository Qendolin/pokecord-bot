const { Scrape } = require('./model/utils')

chrome.browserAction.onClicked.addListener(async () => {
	if (!confirm('Scrape data?')) {
		return
	}
	const data = await Scrape()
	console.log(JSON.stringify(data, null, 2))
})
