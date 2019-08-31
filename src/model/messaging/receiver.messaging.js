// eslint-disable-next-line no-unused-vars
const { Client, Message } = require('discord.js')
const { EventEmitter } = require('events')

/**
 * @callback MessageMapper.Identify
 * @param {Message} message
 * @returns {boolean}
 */

/**
 * @callback MessageMapper.Map
 * @param {Message} message
 * @returns {any|Promise<any>}
 */

/**
 * @typedef MessageMapper
 * @prop {string} type
 * @prop {MessageMapper.Identify} identify
 * @prop {MessageMapper.Map} map
 */

/**
 * @callback Receiver.MessageCallback
 * @param {any|Promise<any>} mappedMessage
 * @param {Message} original
 * @returns {void}
 */

class Receiver extends EventEmitter {
	/**
	 * @param {!Client} client
	 */
	constructor(client, ...mappers) {
		super()
		/**
		 * @public
		 * @type {!Client}
		 * @member Receiver#_callbacks
		 */
		this.client = client
		/**
		 * @private
		 * @type {!Object[]}
		 * @member Receiver#_callbacks
		 */
		this._callbacks = []

		/**
		 * @private
		 * @member Receiver#_started
		 */
		this._started = false

		this._onMessage = this._onMessage.bind(this)

		this.mappers = []
		mappers.forEach((mapper) => {
			this.mappers[mapper.type] = mapper
		})
	}

	/**
	 * Start listening for messages
	 */
	start() {
		if (this._started) {
			return
		}
		this.client.on('message', this._onMessage)
		this._started = true
	}

	/**
	 * Stop listening for messages
	 */
	stop() {
		if (!this._started) {
			return
		}
		this.client.removeListener('message', this._onMessage)
		this._started = false
	}

	/**
	 * @private
	 * @param {Message} message
	 */
	_onMessage(message) {
		for (const type in this.mappers) {
			/**
			 * @type {MessageMapper}
			 */
			const mapper = this.mappers[type]
			if (!mapper.identify(message)) {
				continue
			}

			if (this.listenerCount(type) == 0) {
				continue
			}

			const mappedMessage = mapper.map(message)
			this.emit(type, mappedMessage, message)
		}
	}
}

module.exports = { Receiver }
