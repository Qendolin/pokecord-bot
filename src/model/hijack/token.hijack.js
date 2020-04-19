const unsafe = require('../unsafe/exec.unsafe')

class TokenHijacker {
	disableDevToolsCheck() {
		unsafe.execInPageContext(() => {
			delete window.outerHeight
			delete window.outerWidth
			Object.defineProperty(window, 'outerHeight', {
				set: () => false,
				get: () => window.innerHeight,
				configurable: false,
				enumerable: true,
			})
			Object.defineProperty(window, 'outerWidth', {
				set: () => false,
				get: () => window.innerWidth,
				configurable: false,
				enumerable: true,
			})
		})
	}

	/**
	 * @throws {Error}
	 */
	getToken() {
		const token = window.localStorage.getItem('token')
		if (token == null) {
			throw new Error('token is null. Are dev tools open?')
		}
		return JSON.parse(token)
	}
}

module.exports = new TokenHijacker()
