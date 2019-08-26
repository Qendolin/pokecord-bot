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
	value = parseInt(value, from).toString(to)

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

module.exports = { radix }
