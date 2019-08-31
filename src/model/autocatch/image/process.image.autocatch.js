class CanvasTransformer {
	/**
	 * @param {string|Array|ArrayBuffer|Buffer|Blob|HTMLImageElement} src url or buffer
	 * @returns {Promise<CanvasTransformer>}
	 */
	constructor(src) {
		if (src instanceof HTMLImageElement) {
			this._img = src.cloneNode()
		} else {
			this._img = new Image()
		}

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
		} else if (typeof src === 'string') {
			this._img.src = src
		} else if (src instanceof HTMLImageElement) {
			if (this._img.complete) {
				this._img.onload()
			}
		} else {
			throw new Error(`Unsupported type for 'src'`)
		}

		/**
		 * The canvas index from which
		 */
		this._activeCanvas = 0

		return promise
	}

	/**
	 *
	 * @param {number} width Can be negative
	 * @param {number} height Can be negative
	 */
	resize(width, height) {
		const { read, write } = this._swap()
		width = this._absCoord(width, 0, read.canvas.width)
		height = this._absCoord(height, 0, read.canvas.height)
		write.canvas.width = width
		write.canvas.height = height
		write.ctx.drawImage(read.canvas, 0, 0, read.canvas.width, read.canvas.height, 0, 0, width, height)
		read.canvas.height = height
		read.canvas.width = width

		return this
	}

	filter(name, ...args) {
		const { write } = this._swap()

		switch (name) {
			case 'grayscale':
			case 'invert':
			case 'sepia':
				args[0] = args[0] || '100%'
				break
		}

		write.ctx.filter = `${name}(${args.join(', ')})`

		return this
	}

	/**
	 * @typedef {string} colorMask
	 * @descr An 8 digit string, each two digit can be any hex value or 'XX' if it should be ignored
	 *
	 * @typedef {Object} cropOptions
	 * @prop {string} autoCropValue <colorMask> 'alpha', 'black', 'white'
	 *
	 * @param {number|string} width <number>, 'auto', 'keepAspect'. Can be negative
	 * @param {number|string} height <number>, 'auto', 'keepAspect. Can be negative
	 * @param {number|string} offsetX <number>, 'center'. Ignored if {width} is 'auto'. Can be negative
	 * @param {number|string} offsetY <number>, 'center'. Ignored if {height} is 'auto'. Can be negative
	 * @param {cropOptions} [options]
	 */
	crop(width, height, offsetX, offsetY, options = {}) {
		const { autoCropValue = 'alpha' } = options

		const { read, write } = this._swap()

		let cropCond
		switch (autoCropValue) {
			case 'alpha':
				cropCond = ({ a }) => a === 0
				break
			case 'white':
				cropCond = ({ r, g, b }) => r === 255 && g === 255 && b === 255
				break
			case 'black':
				cropCond = ({ r, g, b }) => r === 0 && g === 0 && b === 0
				break
			default:
				{
					const isMatch = this._parseColorMask(autoCropValue)
					cropCond = ({ r, g, b, a }) => isMatch(r, g, b, a)
				}
				break
		}
		const pixels = read.ctx.getImageData(0, 0, read.canvas.width, read.canvas.height).data

		const findCoords = (dim1, dim2, dir1, dir2, cond) => {
			for (let val1 = dir1 ? 0 : dim1 - 1; dir1 ? val1 < dim1 : val1 >= 0; val1 += dir1 ? 1 : -1) {
				for (let val2 = dir2 ? 0 : dim2 - 1; dir2 ? val2 < dim2 : val2 >= 0; val2 += dir2 ? 1 : -1) {
					if (cond(val1, val2)) {
						return [val1, val2]
					}
				}
			}
			return [dir1 ? dim1 : 0, dir2 ? dim2 : 0]
		}

		let absWidth
		let absOffsetX
		if (typeof width === 'number') {
			absWidth = this._absCoord(width, 0, read.canvas.width)
		} else if (width === 'auto') {
			const [minX] = findCoords(read.canvas.width, read.canvas.height, true, true, (x, y) => {
				const i = (x + y * write.canvas.width) * 4
				const [r, g, b, a] = pixels.slice(i, i + 4)
				return !cropCond({ r, g, b, a })
			})
			const [maxX] = findCoords(read.canvas.width, read.canvas.height, false, true, (x, y) => {
				const i = (x + y * write.canvas.width) * 4
				const [r, g, b, a] = pixels.slice(i, i + 4)
				return !cropCond({ r, g, b, a })
			})
			absWidth = maxX - minX + 1
			absOffsetX = minX
		}

		let absHeight
		let absOffsetY
		if (typeof height === 'number') {
			absHeight = this._absCoord(height, 0, read.canvas.height)
		} else if (height === 'auto') {
			const [minY] = findCoords(read.canvas.height, read.canvas.width, true, true, (y, x) => {
				const i = (x + y * write.canvas.width) * 4
				const [r, g, b, a] = pixels.slice(i, i + 4)
				return !cropCond({ r, g, b, a })
			})
			const [maxY] = findCoords(read.canvas.height, read.canvas.width, false, true, (y, x) => {
				const i = (x + y * write.canvas.width) * 4
				const [r, g, b, a] = pixels.slice(i, i + 4)
				return !cropCond({ r, g, b, a })
			})
			absHeight = maxY - minY + 1
			absOffsetY = minY
		}

		const aspect = read.canvas.width / read.canvas.height
		if (width === 'keepAspect') {
			absWidth = absHeight * aspect
		} else if (height === 'keepAspect') {
			absHeight = absWidth / aspect
		}

		if (height !== 'auto') {
			if (typeof offsetY === 'number') {
				absOffsetY = this._absCoord(offsetY, absHeight, write.canvas.height)
			} else if (offsetY === 'center') {
				absOffsetY = (read.canvas.height - absHeight) / 2
			}
		}

		if (width !== 'auto') {
			if (typeof offsetX === 'number') {
				absOffsetX = this._absCoord(offsetX, absWidth, write.canvas.width)
			} else if (offsetX === 'center') {
				absOffsetX = (read.canvas.width - absWidth) / 2
			}
		}

		write.canvas.width = absWidth
		write.canvas.height = absHeight
		write.ctx.drawImage(read.canvas, absOffsetX, absOffsetY, absWidth, absHeight, 0, 0, absWidth, absHeight)
		read.canvas.width = absWidth
		read.canvas.height = absHeight

		return this
	}

	/**
	 * Sets the aspect ratio
	 *
	 * @param {number} ratio
	 * @param {string} mode 'add', 'sub'
	 * @param {string} [fillStyle] See {@link https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-fillstyle}
	 */
	aspect(ratio, mode, fillStyle) {
		const { read, write } = this._swap()

		let newWidth = read.canvas.width
		let newHeight = read.canvas.height

		let oldRatio = read.canvas.width / read.canvas.height
		if (oldRatio == ratio) {
			return this
		}

		if (mode == 'add') {
			if (read.canvas.width > read.canvas.height) {
				newHeight *= oldRatio / ratio
			} else {
				newWidth *= ratio / oldRatio
			}
		} else if (mode == 'sub') {
			if (read.canvas.width > read.canvas.height) {
				newWidth /= oldRatio / ratio
			} else {
				newHeight /= ratio / oldRatio
			}
		}

		write.canvas.width = newWidth
		write.canvas.height = newHeight
		write.ctx.fillStyle = fillStyle
		write.ctx.fillRect(0, 0, newWidth, newHeight)
		const dWidth = newWidth - read.canvas.width
		const dHeight = newHeight - read.canvas.height
		write.ctx.drawImage(read.canvas, dWidth / 2, dHeight / 2)
		read.canvas.width = newWidth
		read.canvas.height = newHeight
		return this
	}

	/**
	 * @async
	 */
	toBlob() {
		const { read } = this._swap()
		return new Promise((resolve) => {
			read.canvas.toBlob(resolve)
		})
	}

	toDataUrl() {
		const { read } = this._swap()
		return read.canvas.toDataURL()
	}

	toRaw() {
		const { read } = this._swap()
		return read.ctx.getImageData(0, 0, read.canvas.width, read.canvas.height)
	}

	/**
	 *
	 * @param {number} coord The coord (offset, dimension)
	 * @param {*} part The Width of the offseted region
	 * @param {*} max The Width of the containing region
	 */
	_absCoord(coord, part, max) {
		if (coord < 0 || Object.is(coord, -0)) {
			return max - part + coord
		}
		return coord
	}

	_parseColorMask(mask) {
		const xR = mask.slice(0, 2) === 'XX'
		const xG = mask.slice(0, 2) === 'XX'
		const xB = mask.slice(0, 2) === 'XX'
		const xA = mask.slice(0, 2) === 'XX'
		const valR = parseInt(mask.slice(0, 2), 16)
		const valG = parseInt(mask.slice(2, 4), 16)
		const valB = parseInt(mask.slice(4, 6), 16)
		const valA = parseInt(mask.slice(6, 8), 16)
		return (r, g, b, a) => ((xR || r === valR) && (xG || g === valG)) || (xB || b === valB) || (xA || a === valA)
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

		inactiveCtx.drawImage(active, 0, 0)

		this._activeCanvas = +!this._activeCanvas

		activeCtx.save()
		inactiveCtx.restore()

		return {
			read: {
				ctx: inactiveCtx,
				canvas: inactive
			},
			write: {
				ctx: activeCtx,
				canvas: active
			}
		}
	}
}

module.exports = CanvasTransformer
