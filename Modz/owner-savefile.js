import fs from 'fs'
import syntaxError from 'syntax-error'
import path from 'path'
import util from 'util'

const _fs = fs.promises

let modzbotz = async (m, { modz, text, usedPrefix, command, __dirname }) => {
	if (!text) return await replyModz(`*Contoh :* ${usedPrefix + command} main.js`)
	if (!m.quoted) return await replyModz(`*Contoh :* ${usedPrefix + command} main.js Dengan Reply Kodenya`)
	if (/p(lugin)?/i.test(command)) {
		let filename = text.replace(/plugin(s)\//i, '') + (/\.js$/i.test(text) ? '' : '.js')
		const error = syntaxError(m.quoted.text, filename, {
			sourceType: 'module',
			allowReturnOutsideFunction: true,
			allowAwaitOutsideFunction: true
		})
		if (error) throw error
		const pathFile = path.join(__dirname, filename)
		await _fs.writeFile(pathFile, m.quoted.text)
		await replyModz(`
Kode Berhasil Tersimpan Di ${filename}`.trim())
	} else {
		const isJavascript = m.quoted.text && !m.quoted.mediaMessage && /\.js/.test(text)
		if (isJavascript) {
			const error = syntaxError(m.quoted.text, text, {
				sourceType: 'module',
				allowReturnOutsideFunction: true,
				allowAwaitOutsideFunction: true
			})
			if (error) throw error
			await _fs.writeFile(text, m.quoted.text)
			await replyModz(`
Kode Berhasil Tersimpan Di ${text}`.trim())
		} else if (m.quoted.mediaMessage) {
			const media = await m.quoted.download()
			await _fs.writeFile(text, media)
			await replyModz(`Kode Berhasil Tersimpan Di ${text}`)
		} else {
			return await replyModz('Kode Ini Tidak Didukung')
		}
	}
}
modzbotz.help = ['savefile']
modzbotz.tags = ['owner']
modzbotz.command = ['sf', 'savefile']
modzbotz.rowner = true

export default modzbotz