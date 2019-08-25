class Logger {
	constructor(tag = '[PCB]') {
		this.tag = tag
	}

	info() {
		console.info.call(console, this.tag, ...arguments)
	}

	debug() {
		console.debug.call(console, this.tag, ...arguments)
	}

	log() {
		console.log.call(console, this.tag, ...arguments)
	}

	warn() {
		console.warn.call(console, this.tag, ...arguments)
	}

	error() {
		console.error.call(console, this.tag, ...arguments)
	}

	trace() {
		console.trace.call(console, this.tag, ...arguments)
	}
}

module.exports = new Logger()
