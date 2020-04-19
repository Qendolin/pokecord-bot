/**
 *
 * @param {string} value
 * @param {number} from
 * @param {number} to
 * @param {boolean} keepLeadingZeroes
 */
function radix(value, from, to, keepLeadingZeroes = true) {
	if (from === to) {
		return value
	}

	const length = value.length
	value = parseBigInt(value, from).toString(to)

	if (keepLeadingZeroes) {
		if (from > to) {
			const digits = Math.ceil(Math.log(from) / Math.log(to))
			value = value.padStart(digits * length, '0')
		} else {
			const digits = Math.ceil(Math.log(to) / Math.log(from))
			value = value.padStart(Math.ceil(length / digits), '0')
		}
	}

	return value
}

// eslint-disable-next-line no-shadow
function parseBigInt(value, radix) {
	const radixBI = BigInt(radix)
	let result = BigInt(0)
	for (let i = 0; i < value.length; i++) {
		const digit = BigInt(parseInt(value[value.length - i - 1], radix))
		result += digit * radixBI ** BigInt(i)
	}
	return result
}

module.exports = { radix, parseBigInt }
