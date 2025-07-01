import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import axios from 'axios'


let modzbotz = m => m
modzbotz.all = async function(m) {
	let name = m.pushName || await modz.getName(m.sender)
	let pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	try {
		pp = await this.profilePictureUrl(m.sender, 'image')
	} catch (e) {} finally {

		global.idchannel = '120363379975415016@newsletter'
		global.doc = pickRandom(['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/pdf'])
		global.fsizedoc = pickRandom([2000, 3000, 2023000, 2024000])

		global.axios = (await import('axios')).default
		global.fetch = (await import('node-fetch')).default
		global.cheerio = (await import('cheerio')).default
		global.fs = (await import('fs')).default

		global.kontak2 = [
			[owner[0], await modz.getName(owner[0] + info.nomorowner + '@s.whatsapp.net'), `${info.namaowner}`, 'https://whatsapp.com', true],
		]

		global.fkontak = {
			key: {
				fromMe: false,
				participant: m.sender,
				...(m.chat ? {
					remoteJid: info.namabot
				} : {})
			},
			message: {
				contactMessage: {
					displayName: `${name}`,
					vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
				}
			}
		}

        global.zkontak = {
          key: {
            participant: `0@s.whatsapp.net`,
            ...(info.nomorowner && { remoteJid: `0@s.whatsapp.net` })
          },
          message: {
            contactMessage: {
              displayName: `${name}`,
              vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
              sendEphemeral: true
            }
          }
        }

		global.ephemeral = '86400'
		global.ucapan = ucapan()
		global.botdate = date()

		global.fakeig = {
			contextInfo: {
				externalAdReply: {
					showAdAttribution: true,
					title: info.namabot,
					body: ucapan(),
					thumbnailUrl: pp,
					sourceUrl: url.sig
				}
			}
		}
	}
}

export default modzbotz

function date() {
	let d = new Date(new Date + 3600000)
	let locale = 'id'
	let week = d.toLocaleDateString(locale, {
		weekday: 'long'
	})
	let date = d.toLocaleDateString(locale, {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
	let tgl = `${week}, ${date}`
	return tgl
}

function ucapan() {
	const time = moment.tz('Asia/Jakarta').format('HH')
	let res = 'Selamat Malam'
	if (time >= 4) {
		res = 'Selamat Pagi'
	}
	if (time > 10) {
		res = 'Selamat Siang'
	}
	if (time >= 15) {
		res = 'Selamat Sore'
	}
	if (time >= 18) {
		res = 'Selamat Malam'
	}
	return res
}

function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}