export class TokenHijacker {
	static restoreLocalStorage() {
		const handle = window.open(
			window.location.href,
			'Discord thinks it can outsmart ME!!??!',
			`top=${screen.height},left=${screen.width},outerHeight=100,outerWidth=100,menubar=0,toobar=0,location=0,
            personalbar=0,status=0,scrollbars=0,chrome=1,dialog=1,titlebar=0,alwaysLowered=1`
		)
		const storage = handle.localStorage
		Object.defineProperty(window, 'localStorage', {
			set: () => false,
			get: () => storage,
			configurable: false,
			enumerable: true,
			writable: false
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

	static getToken() {
		return window.localStorage.getItem('token')
	}
}
