let modzbotz = async (m, { modz, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
	let isEnable = /true|enable|(turn)?on|1/i.test(command)
	let chat = global.db.data.chats[m.chat]
	let user = global.db.data.users[m.sender]
	let setting = global.db.data.settings[modz.user.jid]
	let type = (args[0] || '').toLowerCase()
	let isAll = false
	let isUser = false
	switch (type) {
		case 'self':
			isAll = true
			if (!isROwner) {
				global.dfail('rowner', m, modz)
				throw false
			}
			global.opts['self'] = isEnable
			break
		default:
			if (!/[01]/.test(command)) return await replyModz(await style(`
Options
⌬ Self

${usedPrefix}on self
${usedPrefix}off self`.trim(), 1))
			throw false
	}
	await replyModz(`${type} Berhasil Di ${isEnable ? 'Aktif' : 'Nonaktif'}kan ${isAll ? 'Untuk Bot Ini' : isUser ? '' : 'Untuk Chat Ini'}
`.trim())
}

modzbotz.help = ['enable', 'disable']
modzbotz.tags = ['main']
modzbotz.command = ['on', 'true', 'enable', 'turnon', 'off', 'false', 'disable', 'turnoff']

export default modzbotz