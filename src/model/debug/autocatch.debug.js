const CanvasTranformer = require('../autocatch/image/process.image.autocatch')
const Scraper = require('../autocatch/scrape/scraper.scrape')

async function imageDifference(src1, src2) {
	const img1 = await new CanvasTranformer(src1)
	const img2 = await new CanvasTranformer(src2)

	const pixels1 = img1.toRaw().data
	const pixels2 = img2.toRaw().data
	const pixels3 = new Array(pixels1.length)

	for (const i in pixels1) {
		const val1 = pixels1[i]
		const val2 = pixels2[i]
		const val3 = Math.abs(val1 - val2)
		pixels3[i] = val3
	}
	const img3 = await new CanvasTranformer(pixels3)
	return img3
}

let pokemonTable
async function getPokemonImage(name) {
	const table = pokemonTable || (await Scraper.getPokemon())
	let id
	for (const i in table) {
		const elem = table[i]
		if (elem.name == name) {
			id = +i + 1
			break
		}
	}
	return await Scraper.extractImgUrl(id, name)
}

module.exports = {
	dHash: require('../autocatch/image/dhash.image.autocatch'),
	aHash: require('../autocatch/image/ahash.image.autocatch'),
	CanvasTranformer,
	PokemonComparer: require('../autocatch/compare.autocatch'),
	imageDifference,
	getPokemonImage,
}
