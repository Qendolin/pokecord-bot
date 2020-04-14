const PokemonComparer = require('../compare.autocatch')
const CanvasTransformer = require('../image/process.image.autocatch')
const { Const } = require('../../utils')
const dHash = require('../image/dhash.image.autocatch')

//TODO: relocate all of this
async function extractImgUrl(pId, pName) {
	pId = `000${pId}`.slice(-3)

	const parser = new DOMParser()

	const html = await fetch(`https://bulbapedia.bulbagarden.net/wiki/File:${pId}${pName}.png`, {
		headers: {
			'Content-Type': 'text/html',
		},
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

async function calcHashes() {
	return new Promise((resolve) => {
		const pokemon = require('../../../data/pokemon')
		const scapedData = {}
		const promises = []
		for (let i = 0; i < pokemon.length; i++) {
			const elem = pokemon[i]
			if (!elem) {
				continue
			}
			const variationName = elem.variation || elem.name
			console.log('downloading ', variationName)
			const willReturn = extractImgUrl(elem.id, variationName)
				.then((url) => {
					console.log(`Found url "${url}" for ${variationName}`)
					return url && PokemonComparer.hashFromUrl(url, Const.ImgHash.Method)
				})
				.then((res) => res && res.hash)
			promises.push(willReturn)
			willReturn.then((hash) => {
				if (!hash) {
					return
				}
				console.log(hash, variationName)
				scapedData[hash] = elem.name
			})
		}
		resolve(Promise.all(promises).then(() => scapedData))
	})
}

async function calcImgs() {
	return new Promise((resolve) => {
		const pokemon = require('../../../data/pokemon')
		const scapedData = {}
		const promises = []
		for (let i = 0; i < pokemon.length; i++) {
			const elem = pokemon[i]
			if (!elem) {
				continue
			}
			const variationName = elem.variation || elem.name
			console.log('downloading ', variationName)
			const willReturn = extractImgUrl(elem.id, variationName)
				.then((url) => {
					console.log(`Found url "${url}" for ${variationName}`)
					return url && fetch(url)
				})
				.then((res) => res && res.blob())
				.then(async (blob) => {
					if (!blob) {
						return
					}
					const img = await new CanvasTransformer(blob)
					img.resize(256, 256)
						.crop('auto', 'auto')
						.aspect(1 / 1, 'add', 'transparent')
					const res = await dHash(await img.toBlob(), {
						width: Const.ImgHash.Resolution + 1,
						height: Const.ImgHash.Resolution + 1,
						direction: Const.ImgHash.Options.direction,
						debug: true,
					})
					console.log(res)
					return res.debug.image
				})
			promises.push(willReturn)
			willReturn.then((url) => {
				if (!url) {
					return
				}
				console.log(url, variationName)
				scapedData[variationName] = url
			})
		}
		resolve(Promise.all(promises).then(() => scapedData))
	})
}

module.exports = { calcHashes, calcImgs, extractImgUrl }
