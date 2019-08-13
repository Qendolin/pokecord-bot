browser.browserAction.onClicked.addListener(tab => {
	browser.tabs.sendMessage(tab.id, { test: 'hello world' })
})
