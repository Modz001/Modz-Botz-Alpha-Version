import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'
let exec = promisify(_exec).bind(cp)

let modzbotz = async (m, { modz, isOwner, command, text }) => {
	if (global.modz.user.jid != modz.user.jid) return
	await replyModz('```Executing...```')
	let o
	try {
		o = await exec(command.trimStart() + ' ' + text.trimEnd())
	} catch (e) {
		o = e
	} finally {
		let {
			stdout,
			stderr
		} = o
		if (stdout.trim()) await replyModz(stdout)
		if (stderr.trim()) await replyModz(stderr)
	}
}
modzbotz.customPrefix = /^[$] /
modzbotz.command = new RegExp
modzbotz.rowner = true

export default modzbotz