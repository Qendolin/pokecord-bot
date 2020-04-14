class Enum {
	constructor(...args) {
		const target = {}
		for (let i = 0; i < args.length; i++) {
			target[args[i]] = args[i]
		}
		return new Proxy(target, {
			set: () => {
				console.warn('Cannot set property of Enum')
				return false
			},
			get: (_, name) => {
				if (name in target) {
					return target[name]
				} else {
					console.warn(`Property '${name}' is not part of Enum`)
				}
			},
		})
	}
}

module.exports = Enum
