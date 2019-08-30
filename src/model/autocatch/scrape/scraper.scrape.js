const PokemonComparer = require('../compare.autocatch')
const CanvasTransformer = require('../image/process.image.autocatch')
const { Const } = require('../../utils')

//TODO: relocate all of this
async function extractImgUrl(pId, pName) {
	//Capitalize
	pName = pName.charAt(0).toUpperCase() + pName.slice(1)
	pId = `000${pId}`.slice(-3)

	const parser = new DOMParser()

	const html = await fetch(`https://bulbapedia.bulbagarden.net/wiki/File:${pId}${pName}.png`, {
		headers: {
			'Content-Type': 'text/html'
		}
	})
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
	return `https:${img.getAttribute('src')}`
}

async function calcHashes(data) {
	return new Promise((resolve) => {
		const scapedData = {}
		const promises = []
		for (let i = 0; i < data.length; i++) {
			const elem = data[i]
			if (!elem) {
				continue
			}
			if (elem.name.indexOf('-mega') !== -1) {
				continue
			}
			console.log('downloading ', elem.name)
			const willReturn = extractImgUrl(i + 1, elem.name)
				.then((url) => url && PokemonComparer.hashFromUrl(url, Const.ImgHash.Method))
				.then((res) => res && res.hash)
			promises.push(willReturn)
			willReturn.then((hash) => {
				if (!hash) {
					return
				}
				console.log(hash, elem.name)
				scapedData[hash] = elem.name
			})
		}
		resolve(Promise.all(promises).then(() => scapedData))
	})
}

function getPokemon() {
	return fetch('https://pokeapi.co/api/v2/pokemon/?limit=69420')
		.then((res) => res.json())
		.then((json) => json.results)
}

async function calcImgs(data) {
	return new Promise((resolve) => {
		const scapedData = {}
		const promises = []
		for (let i = 0; i < data.length; i++) {
			const elem = data[i]
			if (!elem) {
				continue
			}
			if (elem.name.indexOf('-mega') !== -1) {
				continue
			}
			console.log('downloading ', elem.name)
			const willReturn = extractImgUrl(i + 1, elem.name)
				.then((url) => url && fetch(url))
				.then((res) => res && res.blob())
				.then(async (blob) => {
					if (!blob) {
						return
					}
					const img = await new CanvasTransformer(blob)
					img.filter('grayscale').resize(Const.ImgHash.Resolution + 1, Const.ImgHash.Resolution + 1)
					return img.toDataUrl()
				})
			promises.push(willReturn)
			willReturn.then((url) => {
				if (!url) {
					return
				}
				console.log(url, elem.name)
				scapedData[elem.name] = url
			})
		}
		resolve(Promise.all(promises).then(() => scapedData))
	})
}

module.exports = { calcHashes, getPokemon, calcImgs, extractImgUrl }
