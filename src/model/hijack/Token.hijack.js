export class TokenHijacker {
	static restoreLocalStorage() {
		if (
			window.localStorage != null &&
			window.localStorage.constructor != null &&
			window.localStorage.constructor.name === 'Storage'
		)
			return

		const frame = document.createElement('iframe')
		frame.src = ''
		frame.style.setProperty('display', 'none', 'important')
		document.body.appendChild(frame)

		const handle = frame.contentWindow

		delete window.localStorage
		const storage = handle.localStorage
		Object.defineProperty(window, 'localStorage', {
			set: () => false,
			get: () => storage,
			configurable: true,
			enumerable: true
		})
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
