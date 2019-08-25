const CanvasTransformer = require('./process.image.autocatch')
const Logger = require('../../logging/logger.logging')

async function aHash(data, options = {}) {
	const { width = 8, height = 8, radix = 16 } = options
	const img = await new CanvasTransformer(data)
	img.filter('grayscale').resize(width, height)
	const pixels = img.toRaw().data

	let total = 0
	for (let i = 0; i < pixels.length; i += 4) {
		const val = pixels[i]
		total += val
	}

	const average = total / (pixels.length / 4)
	let hash = ''
	for (let i = 0; i < pixels.length; i += 4) {
		const val = pixels[i]
		hash += val > average ? '1' : '0'
	}

	hash = parseInt(hash, 2)
	hash = hash.toString(radix)
	Logger.debug(
		`Computed hash. Total: ${total}, Average: ${average}, Hash: ${hash}, Options: ${JSON.stringify({
			width,
			height,
			radix
		})}`
	)
	return hash
}

module.exports = aHash
