const md5 = require('md5')

async function download(pId, pName) {
	//Capitalize
	pName = pName.charAt(0).toUpperCase() + pName.slice(1)
	pId = `000${pId}`.slice(-3)

	const parser = new DOMParser()

	const html = await fetch(`https://bulbapedia.bulbagarden.net/wiki/File:${pId}${pName}.png`)
		.then((res) => {
			if (!res.ok) {
				return
			}
			return res.text()
		})
		.catch((err) => {
			console.warn(pName, err)
			return
		})

	if (html === undefined) {
		return
	}

	const doc = parser.parseFromString(html, 'text/html')
	const img = doc.querySelector(`#file > a > img`)
	const imgSrc = `https:${img.getAttribute('src')}`

	return fetch(imgSrc)
		.then((res) => res.text())
		.then((txt) => Promise.resolve(md5(txt)))
}

module.exports = async function scrape() {
	return new Promise((resolve) => {
		fetch('https://pokeapi.co/api/v2/pokemon/?limit=69420')
			.then((res) => res.json())
			.then(async (data) => {
				const scapedData = {}
				const results = data.results
				const promises = []
				for (let i = 0; i < results.length; i++) {
					const elem = results[i]
					if (!elem) {
						continue
					}
					if (elem.name.indexOf('-mega') !== -1) {
						continue
					}
					console.log('downloading ', elem.name)
					const willReturn = download(i + 1, elem.name)
					promises.push(willReturn)
					willReturn.then((hash) => {
						if (!hash) {
							return
						}
						console.log(hash, elem.name)
						scapedData[hash] = elem.name
					})
				}
				await Promise.all(promises)
				resolve(scapedData)
			})
	})
}
