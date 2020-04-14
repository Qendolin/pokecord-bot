const aHash = require('./image/ahash.image.autocatch')
const dHash = require('./image/dhash.image.autocatch')
const Logger = require('../logging/logger.logging')
const { Convert, Const } = require('../utils')
const CanvasTransformer = require('./image/process.image.autocatch')

class PokemonComparer {
	/**
	 *
	 * @param {Object.<string,string>} table
	 */
	constructor(table) {
		this.table = table
	}

	/**
	 * @param {string} hash Hash in hex
	 * @returns {object} An object with the properties 'name' and 'distance'
	 */
	bestMatch(hash1) {
		let lowestDistance = Number.MAX_VALUE
		let result
		const hashLength = hash1.length
		const hash1bin = Convert.radix(hash1, 16, 2)
		for (let hash2 in this.table) {
			if (hashLength != hash2.length) {
				//TODO: Dont log error, pass it to caller or something else
				Logger.warn(
					`Hash length does not match. Parameter: '${hash1}' (${hash1.length}), In Table: '${hash2}' (${hash2.length})`
				)
				continue
			}
			const hash2bin = Convert.radix(hash2, 16, 2)
			const dist = PokemonComparer.hammingDistance(hash1bin, hash2bin)
			if (dist < lowestDistance) {
				lowestDistance = dist
				result = {
					name: this.table[hash2],
					hash: hash2,
					distance: dist,
				}
			}
		}
		return result
	}
}

//TODO: Relocate this function
/**
 * @param {string} url Url to a PNG or JPEG
 * @returns {Promise<string>} A promise that resolves to the hash
 */
PokemonComparer.hashFromUrl = (url, algo, options) => {
	return fetch(url)
		.then((res) => res.blob())
		.then(async (blob) => {
			const cropped = await new CanvasTransformer(blob)
			cropped
				.resize(256, 256)
				.crop('auto', 'auto')
				.aspect(1 / 1, 'add', 'transparent')
			const croppedBlob = await cropped.toBlob()
			switch (algo) {
				case 'ahash':
				case 'aHash':
					return aHash(croppedBlob, {
						width: Const.ImgHash.Resolution,
						height: Const.ImgHash.Resolution,
						...options,
					})
				case 'dHash':
				case 'dhash':
					return dHash(croppedBlob, {
						width: Const.ImgHash.Resolution + 1,
						height: Const.ImgHash.Resolution + 1,
						direction: Const.ImgHash.Options.direction,
						...options,
					})
			}
		})
}

//TODO: Relocate this function
/**
 * @param {string} str1
 * @param {string} str2
 * @return {number} hamming distance
 */
PokemonComparer.hammingDistance = (str1, str2) => {
	if (typeof str1 !== 'string' || typeof str2 !== 'string') {
		throw new Error('Arguments must be strings')
	}
	if (str1.length !== str2.length) {
		throw new Error('Arguments must have same length')
	}

	let dist = 0
	for (let i = 0; i < str1.length; i++) {
		if (str1[i] !== str2[i]) {
			dist++
		}
	}
	return dist
}

module.exports = PokemonComparer
