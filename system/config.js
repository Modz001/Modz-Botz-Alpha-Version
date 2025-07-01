import { watchFile, unwatchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

// Setting
global.setting = {
    autoclear: true
}

// Owner
global.owner = [
    ['6283163234218', 'Modz', true],
    ['6283182812597', 'Modz Botz', true],
    ['6283119589990', 'Unknown', true]
]

// Info
global.info = {
    namaowner: 'Modz',
    nomorowner: '6283163234218',
    pairingNumber: '6283182812597',
    namabot: 'Modz Botz',
    nomorbot: '6283182812597',
    wm: 'Modz Never Die',
    stickpack: 'Created by',
    stickauth: 'Modz',
    stylenametitle: '𝗠𝗼𝗱𝘇 𝗕𝗼𝘁𝘇 𝗡𝗲𝘃𝗲𝗿 𝗗𝗶𝗲',
    stylenamebody: '𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗭 𝗗𝗲𝘃',
    stylenamemore1: '𝗠𝗼𝗱𝘇 𝗡𝗲𝘃𝗲𝗿 𝗗𝗶𝗲'
}


// Thumbnail 
global.url = {
    profil: 'https://i.ibb.co/3Fh9V6p/avatar-contact.png',
    thumb: 'https://files.catbox.moe/8381kq.jpg',
    logo: 'https://files.catbox.moe/kewns0.jpg',
    akses: 'https://telegra.ph/file/6c7b9ffbdfb0096e1db3e.jpg',
    welcomes: 'https://telegra.ph/file/1a5df6c2eb53d24d4254c.jpg',
    lefts: 'https://telegra.ph/file/74abb87ac6082571db546.jpg',
    sig: 'https://instagram.com/jarsepay',
    sgh: 'https://github.com/jarsepay',
    sgc: 'https://chat.whatsapp.com/LGrtCe82EpbKvxYohoRxKn',
    sdc: 'https://s.id/aeonnixity',
    sid: 'https://s.id/jarsekai',
    vercel: 'https://modzweb.vercel.app'
}

// Message
global.msg = {
    wait: 'Sedang Menjalankan Perintah...',
    error: 'Terjadi Error, Harap Melapor Ke Owner'
}

// Apikey
global.api = {
    lol: 'GataDios'

}

global.APIKeys = {
    "https://api.lolhumaan.xyz": "GataDios"
}

// API
global.APIs = {
    lol: "https://api.lolhumaan.xyz"
}

global.cpanel = {
    domain: "https://pediapwnnel.zainhosting.my.id",
    apikey: "ptla_qgaU5n66Ndlk6KuuDGr8PYngdqX3AL7d4DMfGIvqklU",
    capikey: "ptlc_VAHCUgpfEuble1xoQtvJ4IDxzmzb3mPXyBfQ1scfdMH",
    nestid: "5",
    egg: "15",
    loc: "1"
}

// RPG & Levelling
global.multiplier = 50
global.rpg = {
    emoticon(string) {
        string = string.toLowerCase()
        let emot = {
            health: '❤️',
            role: '🎭',
            level: '🧬',
            exp: '✨',
            money: '💵',
            limit: '🌟'
        }
        let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
        if (!results.length) return ''
        else return emot[results[0][0]]
    }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
