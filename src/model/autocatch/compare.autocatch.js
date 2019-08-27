const aHash = require('./image/ahash.image.autocatch')
const hamming = require('hamming-distance')

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
		for (const hash2 in this.table) {
			const dist = hamming(parseInt(hash1, 16).toString(2), parseInt(hash2, 16).toString(2))
			if (dist < lowestDistance) {
				lowestDistance = dist
				result = {
					name: this.table[hash2],
					distance: dist
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
PokemonComparer.hashFromUrl = (url) => {
	return fetch(url)
		.then((res) => res.blob())
		.then((blob) => aHash(blob))
}

module.exports = PokemonComparer
