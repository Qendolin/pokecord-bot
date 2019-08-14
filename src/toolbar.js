chrome.browserAction.onClicked.addListener(tab => {
	chrome.tabs.sendMessage(tab.id, { test: 'hello world' })
})
