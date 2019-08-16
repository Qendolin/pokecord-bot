const semicolonize = require('semicolonize')

module.exports = {
	/**
	 * @desc WARNING! Use with caution. Might fail and might be slow.
	 * @param {function} func function to execute in the top (page's) browsing context / frame
	 */
	execInPageContext: function(func) {
		//if firefox
		if (typeof window.wrappedJSObject !== 'undefined') {
			window.eval(`javascript: (${func.toString()})()`)
		} else {
			location.href = semicolonize(`javascript: (${func.toString()})()`)
		}
	}
}
