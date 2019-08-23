// eslint-disable-next-line no-unused-vars
const { Client, Message } = require('discord.js')
const { Enum } = require('../utils')

/**
 * @callback MessageMapper.Identify
 * @param {Message} message
 * @returns {boolean}
 */

/**
 * @callback MessageMapper.Map
 * @param {Message} message
 * @returns {Object}
 */

/**
 * @typedef MessageMapper
 * @prop {MessageMapper.Identify} identify
 * @prop {MessageMapper.Map} map
 */

/**
 * @readonly
 * @enum {string}
 */
const MessageType = new Enum('LevelUp', 'Encounter')

/**
 * @callback Receiver.MessageCallback
 * @param {Object} mappedMessage
 * @param {Message} original
 * @returns {void}
 */

class Receiver {
	/**
	 * @param {!Client} client
	 */
	constructor(client) {
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
	}

	/**
	 * @param {MessageType} type
	 * @param {Receiver.MessageCallback} handler
	 */
	on(type, handler) {
		if (this._callbacks.some((cb) => cb.type === type && cb.handler === handler)) {
			return
		}

		this._callbacks.push({
			type,
			handler
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
	}

	/**
	 * Stop listening for messages
	 */
	stop() {
		if (!this._started) {
			return
		}
		this.client.removeListener('message', this._onMessage)
	}

	/**
	 * @private
	 * @param {Message} message
	 */
	_onMessage(message) {
		for (const type in Receiver.MessageMappers) {
			/**
			 * @type {MessageMapper}
			 */
			const mapper = Receiver.MessageMappers[type]
			if (!mapper.identify(message)) {
				continue
			}

			const cbs = this._callbacks.filter((cb) => cb.type === type)
			if (cbs.length == 0) {
				break
			}

			const mappedMessage = mapper.map(message)
			cbs.forEach((cb) => cb.handler(mappedMessage, message))

			break
		}
	}
}

/**
 * @static
 * @memberof Receiver
 * @type {Object.<MessageType, MessageMapper>}
 */
Receiver.MessageMappers = {
	[MessageType.LevelUp]: {
		/**
		 * @param {Message} message
		 */
		identify: (message) => {
			const titleRegex = /^Congratulations .*!$/
			const descrRegex = /^Your [\u{0000}-\u{FFFF}]+ is now level \d{1,3}!$/u
			try {
				return (
					message.author.username === 'Pokécord' &&
					message.embeds[0].title.match(titleRegex) &&
					message.embeds[0].description.match(descrRegex)
				)
			} catch (_) {
				return false
			}
		},
		/**
		 * @param {Message} message
		 */
		map: (message) => {
			const titleRegex = /^Congratulations (.*)!$/
			const descrRegex = /^Your ([\u{0000}-\u{FFFF}]+) is now level (\d{1,3})!$/u
			const username = titleRegex.exec(message.embeds[0].title)[1]
			const [, pokemon, level] = descrRegex.exec(message.embeds[0].description)
			return {
				pokemon,
				level,
				username
			}
		}
	},
	[MessageType.Encounter]: {
		//TODO
	}
}

module.exports = { Receiver, MessageType }
