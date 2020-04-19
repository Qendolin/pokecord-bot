const CanvasTransformer = require('./process.image.autocatch')
const Logger = require('../../logging/logger.logging')
const { Convert } = require('../../utils')

/**
 * @typedef dHashOptions
 * @prop {number} width Should be 1 higher than {height} if {direction} is 'horizontal'
 * @prop {number} height Should be 1 higher than {width} if {direction} is 'vertical'
 * @prop {number} radix The radix of the hash
 * @prop {string} direction 'vertical', 'horizontal' or 'both'. 'both' will double the length of the hash
 *
 * @param {*} data
 * @param {dHashOptions} options
 */
async function dHash(data, options = {}) {
	const { width = 9, height = 8, radix = 16, direction = 'horizontal', debug = false } = options
	const img = await new CanvasTransformer(data)
	img.filter('grayscale').resize(width, height)
	const pixels = img.toRaw().data

	let hash = ''
	if (direction == 'horizontal' || direction == 'both') {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width - 1; x++) {
				const i = (x + y * width) * 4
				hash += pixels[i] > pixels[i + 4] ? '1' : '0'
			}
		}
	}
	if (direction == 'vertical' || direction == 'both') {
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height - 1; y++) {
				const i = (x + y * width) * 4
				hash += pixels[i] > pixels[i + width] ? '1' : '0'
			}
		}
	}
	hash = Convert.radix(hash, 2, radix)
	Logger.debug(
		`Computed hash. Hash: ${hash}, Options: ${JSON.stringify({
			width,
			height,
			radix,
		})}`
	)
	const result = {
		hash,
	}
	if (debug) {
		result.debug = {
			image: img.toDataUrl(),
		}
	}
	return result
}

module.exports = dHash
