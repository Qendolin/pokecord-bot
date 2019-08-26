// eslint-disable-next-line no-unused-vars
const { Client, Message } = require('discord.js')
const { Enum, Const } = require('../utils')
const Logger = require('../logging/logger.logging')

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
 * @prop {MessageMapper.Identify} identify
 * @prop {MessageMapper.Map} map
 */

/**
 * @readonly
 * @enum {string}
 */
const MessageType = new Enum('LevelUp', 'Encounter', 'Any')

/**
 * @callback Receiver.MessageCallback
 * @param {any|Promise<any>} mappedMessage
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
				continue
			}

			const mappedMessage = mapper.map(message)
			cbs.forEach((cb) => cb.handler(mappedMessage, message))
		}
	}
}

/**
 * @static
 * @memberof Receiver
 * @type {Object.<MessageType, MessageMapper>}
 */
Receiver.MessageMappers = new Proxy(
	{
		[MessageType.LevelUp]: {
			identify: (msg) => {
				const titleRegex = /^Congratulations .*!$/
				const descrRegex = /^Your [\u{0000}-\u{FFFF}]+ is now level \d{1,3}!$/u
				try {
					return (
						msg.author.id == Const.PokecordId &&
						msg.embeds[0].title.match(titleRegex) &&
						msg.embeds[0].description.match(descrRegex)
					)
				} catch (_) {
					return false
				}
			},
			map: (msg) => {
				const titleRegex = /^Congratulations (.*)!$/
				const descrRegex = /^Your ([\u{0000}-\u{FFFF}]+) is now level (\d{1,3})!$/u
				const username = titleRegex.exec(msg.embeds[0].title)[1]
				const [, pokemon, level] = descrRegex.exec(msg.embeds[0].description)
				return {
					pokemon,
					level,
					username
				}
			}
		},
		[MessageType.Any]: {
			identify: (msg) => msg.author.id == Const.PokecordId,
			map: (msg) => msg
		}
	},
	{
		set: (target, prop, value) => {
			target[prop] = value
			Logger.debug(`Registered MessageMapper for type '${prop}'`)
		}
	}
)

module.exports = { Receiver, MessageType }
