export class TokenHijacker {
	static restoreLocalStorage() {
		if (
			window.localStorage != null &&
			window.localStorage.constructor != null &&
			window.localStorage.constructor.name === 'Storage'
		)
			return
		const handle = window.open(window.location.href, 'Discord thinks it can outsmart ME!!??!')
		const storage = handle.localStorage
		delete window.localStorage
		Object.defineProperty(window, 'localStorage', {
			set: () => false,
			get: () => storage,
			configurable: false,
			enumerable: true
		})
		handle.close()
	}

	static disableDevToolsCheck() {
		delete window.outerHeight
		delete window.outerWidth
		Object.defineProperty(window, 'outerHeight', {
			set: () => false,
			get: () => window.innerHeight
		})
		Object.defineProperty(window, 'outerWidth', {
			set: () => false,
			get: () => window.innerWidth
		})
	}

	/**
	 * @throws {SecurityError} If a SecruityError is thrown in Chrome, go to chrome://settings/content/cookies
	 *                         and whitelist https://discordapp.com/
	 * @throws {ReferenceError}
	 */
	static getToken() {
		if (window.localStorage == null || typeof window.localStorage.getItem !== 'function') {
			throw new ReferenceError('Cannot access localStorage. Was it restored before?')
		}
		return window.localStorage.getItem('token')
	}
}
