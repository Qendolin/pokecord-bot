//TODO: Rename
class CanvasTransformer {
	/**
	 * @param {Array|ArrayBuffer|Buffer|Blob} src buffer
	 * @returns {Promise<CanvasTransformer>}
	 */
	constructor(src) {
		this._img = new Image()
		if (Buffer.isBuffer(src)) {
			src = [...src]
		}

		let fromObjectUrl = false
		const promise = new Promise((resolve, reject) => {
			this._img.onload = () => {
				this._canvas1 = document.createElement('canvas')
				this._canvas1.width = this._img.width
				this._canvas1.height = this._img.height
				this._ctx1 = this._canvas1.getContext('2d')
				this._ctx1.drawImage(this._img, 0, 0)

				this._canvas2 = document.createElement('canvas')
				this._canvas2.width = this._img.width
				this._canvas2.height = this._img.height
				this._ctx2 = this._canvas2.getContext('2d')

				if (fromObjectUrl) {
					this._swap()
					URL.revokeObjectURL(src)
				}

				resolve(this)
			}
			this._img.onerror = (err) => {
				if (fromObjectUrl) {
					URL.revokeObjectURL(src)
				}
				reject(err)
			}
		})

		if (
			src instanceof ArrayBuffer ||
			Array.isArray(src) ||
			(src.__proto__ && src.__proto__.__proto__ && src.__proto__.__proto__.constructor.name === 'TypedArray')
		) {
			src = new Blob(src)
		}

		if (src instanceof Blob) {
			fromObjectUrl = true
			this._img.src = URL.createObjectURL(src)
		} else {
			throw new Error(`Unsupported type for 'src'`)
		}

		/* TODO:  else if (typeof src === 'string') {
			this._img.src = src
		} */

		this._activeCanvas = 0

		return promise
	}

	resize(width, height) {
		const { read, write } = this._swap()
		write.canvas.width = width
		write.canvas.height = height
		write.ctx.drawImage(read.canvas, 0, 0, read.canvas.width, read.canvas.height, 0, 0, width, height)

		return this
	}

	filter(name, ...args) {
		const { write } = this._swap()
		write.ctx.filter = `${name}(${args.join(', ')})`

		return this
	}

	toBlob() {
		const { read } = this._swap()
		return read.canvas.toBlob()
	}

	toDataUrl() {
		const { read } = this._swap()
		return read.canvas.toDataURL()
	}

	toRaw() {
		const { read } = this._swap()
		return read.ctx.getImageData(0, 0, read.canvas.width, read.canvas.height)
	}

	_swap() {
		/**
		 * @type {HTMLCanvasElement}
		 */
		const active = this[`_canvas${+this._activeCanvas + 1}`]
		/**
		 * @type {HTMLCanvasElement}
		 */
		const inactive = this[`_canvas${+!this._activeCanvas + 1}`]

		/**
		 * @type {CanvasRenderingContext2D}
		 */
		const activeCtx = this[`_ctx${+this._activeCanvas + 1}`]
		/**
		 * @type {CanvasRenderingContext2D}
		 */
		const inactiveCtx = this[`_ctx${+!this._activeCanvas + 1}`]

		inactive.width = active.width
		inactive.height = active.height
		inactiveCtx.drawImage(active, 0, 0)

		this._activeCanvas = +!this._activeCanvas

		activeCtx.restore()
		inactiveCtx.save()

		return {
			write: {
				ctx: inactiveCtx,
				canvas: inactive
			},
			read: {
				ctx: activeCtx,
				canvas: active
			}
		}
	}
}

module.exports = CanvasTransformer
