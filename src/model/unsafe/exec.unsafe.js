const bookmarkleter = require('bookmarkleter')

module.exports = {
	/**
	 * @desc WARNING! Use with caution. Might fail and might be slow.
	 * @param {function} func function to execute in the top (page's) browsing context / frame
	 * @throws {Error} If {func} cannot be serialized
	 */
	execInPageContext: function (func) {
		const code = func.toString()
		//if firefox
		if (typeof window.wrappedJSObject !== 'undefined') {
			window.eval(`(${code})()`)
		} else {
			const result = bookmarkleter(`(${code})()`, {
				urlencode: false,
				minify: true,
			})
			location.href = result
		}
	},
}
