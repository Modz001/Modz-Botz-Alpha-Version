import fs from 'fs'
import moment from 'moment-timezone'
import { xpRange } from '../lib/levelling.js'
import { platform } from 'node:process'
import os from 'os'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

let tags = {
	"advanced": "Advanced",
	"info": "Info",
	"main": "Main",
	"owner": "Owner",
}
const defaultMenu = {
	before: `
*%ucapan %pushname*
*Berikut Adalah Semua Fitur Yang Ada Di Modz Botz Aplha Version*
%readmore
`.trimStart(),
	header: '*❆═━═『 %category 』═━═❆*',
	body: '*⌬ %cmd* %isLimit %isPremium %isReseller',
	footer: '',
	after: info.wm,
}
let modzbotz = async (m, { modz, usedPrefix: _p, text }) => {
	try {
		let { exp, limit, level, role } = global.db.data.users[m.sender]
		let { min, xp, max } = xpRange(level, global.multiplier)
		let name = m.sender
		let taguser = `@${(m.sender || '').replace(/@s\.whatsapp\.net/g, '')}`
		let pushname = m.pushName || "Unknown"
		let names = await modz.getName(m.sender)
		let botnama = info.namabot
		let ucapans = ucapan()
		let d = new Date(new Date + 3600000)
		let locale = 'id'
		const dd = new Date('2023-01-01')
		const locales = 'en'
		const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
		const wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
		const wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
		let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
		let week = d.toLocaleDateString(locale, {
			weekday: 'long'
		})
		let date = d.toLocaleDateString(locale, {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
		let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(d)

		const platform = os.platform()

		const targetDate = new Date('January 1, 2025 00:00:00')
		const currentDate = new Date()
		const remainingTime = targetDate.getTime() - currentDate.getTime()
		const seconds = Math.floor(remainingTime / 1000) % 60
		const minutes = Math.floor(remainingTime / 1000 / 60) % 60
		const hours = Math.floor(remainingTime / 1000 / 60 / 60) % 24
		const days = Math.floor(remainingTime / 1000 / 60 / 60 / 24)
		let dateCountdown = `${days} Hari, ${hours} Jam, ${minutes} Menit, ${seconds} Detik Lagi Menuju Tahun Baru!`

		let time = d.toLocaleTimeString(locale, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		})
		let _uptime = process.uptime() * 1000
		let _muptime
		if (process.send) {
			process.send('uptime')
			_muptime = await new Promise(resolve => {
				process.once('message', resolve)
				setTimeout(resolve, 1000)
			}) * 1000
		}
		let muptime = clockString(_muptime)
		let uptime = clockString(_uptime)
		let totalreg = Object.keys(global.db.data.users).length
		let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
		let help = Object.values(global.modzbotz).filter(modzbotz => !modzbotz.disabled).map(modzbotz => {
			return {
				help: Array.isArray(modzbotz.tags) ? modzbotz.help : [modzbotz.help],
				tags: Array.isArray(modzbotz.tags) ? modzbotz.tags : [modzbotz.tags],
				prefix: 'customPrefix' in modzbotz,
				limit: modzbotz.limit,
				premium: modzbotz.premium,
				reseller: modzbotz.reseller,
				enabled: !modzbotz.disabled,
			}
		})
		for (let modzbotz of help)
			if (modzbotz && 'tags' in modzbotz)
				for (let tag of modzbotz.tags)
					if (!(tag in tags) && tag) tags[tag] = tag
		modz.menu = modz.menu ? modz.menu : {}
		let before = modz.menu.before || defaultMenu.before
		let header = modz.menu.header || defaultMenu.header
		let body = modz.menu.body || defaultMenu.body
		let footer = modz.menu.footer || defaultMenu.footer
		let after = modz.menu.after || (modz.user.jid == global.modz.user.jid ? '' : `Powered By https://wa.me/${global.modz.user.jid.split`@`[0]}`) + defaultMenu.after
		let _text = [
			before,
			...Object.keys(tags).map(tag => {
				return header.replace(/%category/g, tags[tag]) + '\n' + [
					...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
						return menu.help.map(help => {
							return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
								.replace(/%isLimit/g, menu.limit ? '🅛' : '')
								.replace(/%isPremium/g, menu.premium ? '🅟' : '')
								.replace(/%isReseller/g, menu.reseller ? '🅡' : '')
								.trim()
						}).join('\n')
					}),
					footer
				].join('\n')
			}),
			after
		].join('\n')
		text = typeof modz.menu == 'string' ? modz.menu : typeof modz.menu == 'object' ? _text : ''
		let replace = {
			'%': '%',
			p: _p,
			uptime,
			muptime,
			me: modz.getName(modz.user.jid),
			ucapan: ucapan(),
			exp: exp - min,
			maxexp: xp,
			totalexp: exp,
			xp4levelup: max - exp,
			level,
			limit,
			name,
			names,
			weton,
			week,
			date,
			dateIslamic,
			dateCountdown,
			platform,
			wib,
			wit,
			wita,
			time,
			totalreg,
			rtotalreg,
			role,
			taguser,
			pushname,
			readmore: readMore
		}
		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

   await modz.sendMessage(m.chat, {
 footer: '© Modz Botz | Modz Never Die',
 buttons: [
 {
   buttonId: `.owner`,
   buttonText: { displayText: 'Owner' },
   type: 1
 },
 {
   buttonId: `.ping`,
   buttonText: { displayText: 'Ping' },
   type: 1
 },
  ],
  headerType: 1,
  viewOnce: true,
  document: { url: 'https://files.catbox.moe/r7jtt2.text' },
  fileName: `${info.stylenamemore1}`,
  mimetype: 'image/png',
  fileLength: "999999999999",
  jpegThumbnail: await modz.resize(await getBuffer('https://files.catbox.moe/kewns0.jpg'), 400, 400),
  caption: await style(text),
  contextInfo: {
   isForwarded: false, 
   forwardedNewsletterMessageInfo: {
   newsletterJid: "120363379975415016@newsletter",
   newsletterName: "Modz Never Die",
   },   
    externalAdReply: {
      title: `${info.stylenametitle}`,
      body: `${info.stylenamebody}`,
      thumbnailUrl: "https://files.catbox.moe/d8yovi.jpg",
      sourceUrl: "https://ẉ.ceo/modzweb",
      mediaType: 1,
      renderLargerThumbnail: true,
    },
  },
}, { quoted: global.zkontak });
	} catch (error) {
		console.error(error)
		throw 'Error : ' + error.message
	}
}

modzbotz.help = ['menu']
modzbotz.tags = ['main']
modzbotz.command = ['menu', 'allmenu']
modzbotz.unreg = true

export default modzbotz

async function getBuffer(url, options) {
  try {
    const res = await axios({ method: "get", url, responseType: 'arraybuffer', ...options });
    return res.data;
  } catch (err) {
    return err;
  }
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
	const hour_now = moment.tz('Asia/Jakarta').format('HH')
	var ucapanWaktu = 'Selamat pagi'
	if (hour_now >= '03' && hour_now <= '10') {
		ucapanWaktu = 'Selamat pagi'
	} else if (hour_now >= '10' && hour_now <= '15') {
		ucapanWaktu = 'Selamat siang'
	} else if (hour_now >= '15' && hour_now <= '17') {
		ucapanWaktu = 'Selamat sore'
	} else if (hour_now >= '17' && hour_now <= '18') {
		ucapanWaktu = 'Selamat sore'
	} else if (hour_now >= '18' && hour_now <= '23') {
		ucapanWaktu = 'Selamat malam'
	} else {
		ucapanWaktu = 'Selamat malam'
	}
	return ucapanWaktu
}

async function getRAM() {
	const {
		totalmem
	} = await import('os')
	return Math.round(totalmem / 1024 / 1024)
}