var uglify = require('uglifyjs-browser')

module.exports = {
	/**
	 * @desc WARNING! Use with caution. Might fail and might be slow.
	 * @param {function} func function to execute in the top (page's) browsing context / frame
	 * @throws {Error} If {func} cannot be serialized
	 */
	execInPageContext: function(func) {
		//if firefox
		if (typeof window.wrappedJSObject !== 'undefined') {
			window.eval(`(${func.toString()})()`)
		} else {
			const result = uglify.minify(code)
			if (result.error) throw result.error
			location.href = `javascript: (() => {${result.code}})()`
		}
	}
}
