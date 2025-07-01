import syntaxerror from 'syntax-error'
import { format } from 'util'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

let handler = async (m, _2) => {
	let { modz, usedPrefix, noPrefix, args, groupMetadata } = _2
	let _return
	let _syntax = ''
	let _text = (/^=/.test(usedPrefix) ? 'return ' : '') + noPrefix
	let old = m.exp * 1
	try {
		let i = 15
		let f = {
			exports: {}
		}
		let exec = new(async () => {}).constructor('print', 'm', 'handler', 'require', 'modz', 'Array', 'process', 'args', 'groupMetadata', 'module', 'exports', 'argument', _text)
		_return = await exec.call(modz, (...args) => {
			if (--i < 1) return
			console.log(...args)
			return modz.reply(m.chat, format(...args), m)
		}, m, handler, require, modz, CustomArray, process, args, groupMetadata, f, f.exports, [modz, _2])
	} catch (e) {
		let err = syntaxerror(_text, 'Execution Function', {
			allowReturnOutsideFunction: true,
			allowAwaitOutsideFunction: true,
			sourceType: 'module'
		})
		if (err) _syntax = '```' + err + '```\n\n'
		_return = e
	} finally {
		modz.reply(m.chat, _syntax + format(_return), m)
		m.exp = old
	}
}
handler.help = ['>', '=>']
handler.tags = ['advanced']
handler.customPrefix = /^=?> /
handler.command = /(?:)/i

handler.rowner = true

export default handler

class CustomArray extends Array {
	constructor(...args) {
		if (typeof args[0] == 'number') return super(Math.min(args[0], 10000))
		else return super(...args)
	}
}