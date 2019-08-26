const CanvasTransformer = require('./process.image.autocatch')
const Logger = require('../../logging/logger.logging')
const { Convert } = require('../../utils')

async function dHash(data, options = {}) {
	const { width = 9, height = 8, radix = 16 } = options
	const img = await new CanvasTransformer(data)
	img.filter('grayscale').resize(width, height)
	const pixels = img.toRaw().data

	let hash = ''
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width - 1; x++) {
			const i = (x + y * width) * 4
			hash += pixels[i] > pixels[i + 4] ? '1' : '0'
		}
	}
	hash = Convert.radix(hash, 2, radix)
	Logger.debug(
		`Computed hash. Hash: ${hash}, Options: ${JSON.stringify({
			width,
			height,
			radix
		})}`
	)
	return hash
}

module.exports = dHash
