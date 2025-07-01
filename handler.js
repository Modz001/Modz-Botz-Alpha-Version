import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fs from 'fs'
import fetch from 'node-fetch'
import cron from 'node-cron'
import moment from 'moment-timezone'

const premiumDB = JSON.parse(fs.readFileSync('./lib/database/premium.json'))
const resellerDB = JSON.parse(fs.readFileSync('./lib/database/reseller.json'))
const ownermoreDB = JSON.parse(fs.readFileSync('./lib/database/ownermore.json'))
/**
 * @type {import('@whiskeysockets/baileys')}
 */
const {
    proto,
    getAggregateVotesInPollMessage
} = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function() {
    clearTimeout(this)
    resolve()
}, ms))

/**
 * Handle messages upsert
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
 
export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    modz.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]

    global.replyModz = async function (text) {
      await modz.sendMessage(m.chat, {
        text,
        contextInfo: {
          externalAdReply: {
            title: info.namabot,
            body: ucapan(),
            previewType: 'PHOTO',
            thumbnailUrl: url.logo,
            sourceUrl: url.vercel
          }
        }
      }, { quoted: global.zkontak })
    }

    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.limit = false
        try {
            // TODO: use loop to insert data instead of this
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
               if (!isNumber(user.health)) user.health = 100
               if (!isNumber(user.level)) user.level = 0
               if (!isNumber(user.exp)) user.exp = 0
               if (!isNumber(user.limit)) user.limit = 25
               if (!isNumber(user.limits)) user.limits = 50
               if (!isNumber(user.lastResetlimits)) user.lastResetlimits = 0
               if (!isNumber(user.money)) user.money = 0
               
               if (!isNumber(user.premiumDate)) user.premiumDate = 0
               if (!isNumber(user.bannedDate)) user.bannedDate = 0
               
               if (!user.registered) {
                   if (!('name' in user)) user.name = m.name
                   if (!isNumber(user.age)) user.age = -1
                   if (!isNumber(user.regTime)) user.regTime = -1
               }
               
               if (!('banned' in user)) user.banned = false
               if (!('premium' in user)) user.premium = false
               if (!('registered' in user)) user.registered = false
               
               if (!("role" in user)) user.role = "Pemula"
            } else
                global.db.data.users[m.sender] = {
                   health: 100,
                   level: 0,
                   exp: 0,
                   limit: 25,
                   limits: 50,
                   money: 0,
                   
                   name: m.name,
                   age: -1,
                   regTime: -1,
                   premiumDate: 0,
                   bannedDate: 0,
                   
                   banned: false,
                   premium: false,
                   registered: false,
                   
                   role: 'Pemula',
                }

                global.limits = `${global.db.data.users[m.sender].limits}`

                function LimitsDaily() {
                  const now = Date.now()
                  for (const jid in global.db.users) {
                    const user = global.db.users[jid]
                    if ((now - user.lastLimits) > 86400000) {
                  user.limits = 50
                  user.lastLimits = now
                }
              }
            }

              cron.schedule('0 0 * * *', () => {
              LimitsDaily()
            })

            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false
                if (!('sWelcome' in chat))
                    chat.sWelcome = ''
                if (!('sBye' in chat))
                    chat.sBye = ''
                if (!('sPromote' in chat))
                    chat.sPromote = ''
                if (!('sDemote' in chat))
                    chat.sDemote = ''
                if (!('antiLink' in chat))
                    chat.antiLink = false
                if (!('antiToxic' in chat)) 
                    chat.antiToxic = false
                if (!('autolevelup' in chat)) 
                    chat.autolevelup = false
                if (!('delete' in chat))
                    chat.delete = false
                if (!('detect' in chat))
                    chat.detect = false
                if (!('game' in chat))
                    chat.game = false
                if (!('nsfw' in chat))
                    chat.nsfw = false
                if (!('rpg' in chat))
                    chat.rpg = false
                if (!('welcome' in chat))
                    chat.welcome = false
                if (!isNumber(chat.expired))
                    chat.expired = 0
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '',
                    sDemote: '',
                    antiLink: false,
                    antiToxic: false,
                    autolevelup: false,
                    delete: false,
                    detect: false,
                    game: false,
                    nsfw: false,
                    rpg: false,
                    welcome: false,
                    expired: 0,
                }
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = true
                if (!('autobio' in settings)) settings.autobio = false
                if (!('restrict' in settings)) settings.restrict = true
                if (!('autorestart' in settings)) settings.autorestart = true
                if (!('anticall' in settings)) settings.antiCall = true
                if (!('image' in settings)) settings.image = true
                if (!('gif' in settings)) settings.gif = false 
                if (!('teks' in settings)) settings.teks = false
                if (!('doc' in settings)) settings.doc = false
                if (!('loc' in settings)) settings.loc = false
                if (!isNumber(settings.status)) settings.status = 0
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: true,
                autobio: false,
                antiCall: true, 
                restrict: true,
                autorestart: false,
                image: true,
                gif: false,
                teks: false,
                doc: false,
                loc: false,
                status: 0
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['nyimak'])
            return
        if (!m.fromMe && opts['self'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''

        const isROwner = [modz.decodeJid(global.modz.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || db.data.users[m.sender].owner
        const isPrem = isROwner || premiumDB.includes(m.sender)
        const isReseller = resellerDB.includes(m.sender)
        const isOwnerMore = ownermoreDB.includes(m.sender)

        if (opts['queque'] && m.text && !(isMods || isPrem)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)
        
        // Auto Respon Anti Kasar, Salam, dan P Deteksi
        const budy = (m.body || m.message?.conversation || '').toLowerCase()
        const senderUsername = m.sender?.split('@')[0]

        const kataKasar = [
  'anjing', 'babi', 'goblok', 'tolol', 'kontol', 'memek',
  'pepek', 'pea', 'monyet', 'bangsat', 'ngentod',
  'ngentot', 'kntl', 'peju', 'mmk'
        ]

        if (kataKasar.some(kata => budy.includes(kata))) {
          await modz.sendMessage(m.chat, {
            text: `*Maaf* @${senderUsername}\nTolong Jaga Bahasamu Ya!`,
            mentions: [m.sender]
          }, { quoted: m })
          return
        }

        if (/(as+|ass+)(a+)?(l+)?(a+)?(m+)?(u+)?[’' ]?(a+)?l[a]+i[kq]+[uo]+m/i.test(budy)) {
          await modz.sendMessage(m.chat, {
            text: `Wa'alaikumussalam Warahmatullahi Wabarakatuh @${senderUsername}`,
            mentions: [m.sender]
          }, { quoted: m })
          return
        }

        if (/^p$/i.test(budy)) {
          await modz.sendMessage(m.chat, {
            text: `*Maaf* @${senderUsername}\nLebih Baik Ucapkan Salam Daripada Hanya "P"`,
            mentions: [m.sender]
              }, { quoted: m })
          return
        }

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const groupMetadata = (m.isGroup ? ((modz.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => modz.decodeJid(u.id) === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => modz.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './Modz')
        for (let name in global.modzbotz) {
            let plugin = global.modzbotz[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await modz.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*『 System Notification 』*

*『 Plugins 』* : ${name}
*『 Sender 』* : ${m.sender}
*『 Chat 』* : ${m.chat}
*『 Command 』* : ${m.text}

\`\`\`${format(e)}\`\`\`

${info.namabot}
`.trim(), data.jid)
                    }
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    global.dfail('restrict', m, this)
                    continue
                }
                
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : modz.prefix ? modz.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    modz: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrem,
                    isReseller,
                    isOwnerMore,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'gc-unmute.js' && name != 'gc-mute.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned && !user?.owner)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.premium && !isPrem) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.ownermore && !isOwnerMore) {
                    fail('ownermore', m, this)
                    continue
                }
                if (plugin.reseller && !isReseller) {
                    fail('reseller', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register && !global.db.data.users[m.sender]?.registered) {
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 100 // mendapatkan exp tiap command 
                if (xp > 200)
                    m.reply('Ngecit')
                else
                    m.exp += xp
                if (!isPrem && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 7) {
                    this.reply(m.chat, `Limit telah mencapai batas maksimal.\nSegera berlangganan ke premium untuk menikmati limit tak terbatas ⚡`, m)
                    continue
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `Diperlukan level ${plugin.level} untuk menggunakan perintah ini\n*Level Kamu:* ${_user.level}`, m)
                    continue
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    modz: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrem,
                    isReseller,
                    isOwnerMore,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrem)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        if (e.name)
                            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await modz.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    m.reply(`*『 System Notification 』*

*⌬ Plugins :* ${name}
*⌬ Sender :* ${m.sender}
*⌬ Chat :* ${m.chat}
*⌬ Command :* ${usedPrefix}${command} ${args.join(' ')}

*『 Error Log 』* :

\`\`\`${text}\`\`\`

${info.namabot}
`.trim(), data.jid)
                            }
                        m.reply(text)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 8
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total)) stat.total = 1
                    if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last)) stat.last = now
                    if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
                } else stat = stats[m.plugin] = {
                    total: 1,
                    success: m.error != null ? 0 : 1,
                    last: now,
                    lastSuccess: m.error != null ? 0 : now
                }
                stat.total += 1
                
                if (m.isGroup) global.db.data.chats[m.chat].delay = now
                else global.db.data.users[m.sender].delay = now

                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (global.db.data.settings[this.user.jid].autoread) await this.readMessages([m.key])
    }
}


/**
 * Handle groups participants update
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
    
export async function pollUpdate(message) {
    for (const {
            key,
            update
        }
        of message) {
        if (message.pollUpdates) {
            const pollCreation = await modz.serializeM(modz.loadMessage(key.id))
            if (pollCreation) {
                const pollMessage = await getAggregateVotesInPollMessage({
                    message: pollCreation.message,
                    pollUpdates: pollCreation.pollUpdates,
                })
                message.pollUpdates[0].vote = pollMessage

                await console.log(pollMessage)
                modz.appenTextMessage(message, message.pollUpdates[0].vote || pollMessage.filter((v) => v.voters.length !== 0)[0]?.name, message.message)
            }
        }
    }
}
/**
 * Handle groups update
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || modz.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || modz.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || modz.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || modz.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await modz.sendMessage(id, { text: text })
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe)
            return
        let msg = modz.serializeM(modz.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[id] || {}
    
        if (chat.delete) return
        
        await modz.reply(msg.chat, `
Terdeteksi @${participant.split`@`[0]} Baru Saja Telah Menghapus Sebuah Pesan
Untuk Mematikan Fitur Ini, Ketik
*.disable antidelete*
`.trim(), msg, {
            mentions: [participant]
        })
        modz.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, modz) => {
let tag = `@${m.sender.replace(/@.+/, '')}`
let mentionedJid = [m.sender]
let name = modz.getName(m.sender)

let msg = {
    premium: 'Fitur Ini Hanya Dapat Digunakan Oleh Pengguna *Premium*',
    reseller: 'Fitur Ini Hanya Dapat Di Gunakan Oleh Reseller Panel, Jika Ingin Menjadi Reseller Silahkan Beli Ke Owner',
    group: 'Fitur Ini Hanya Dapat Digunakan Dalam Grup',       
    private: 'Fitur Ini Hanya Dapat Digunakan Dalam Private Chat',       
    botAdmin: 'Jadikan Bot Sebagai admin Agar Bot Dapat Mengakses Grup',
    admin: 'Fitur Ini Hanya Dapat Digunakan Oleh Para *Admin Grup*',
    restrict: 'Restrict Tidak Di Nyalakan Pada Bot Ini',
    game: 'Fitur *Game* Tidak Di Nyalakan Pada Chat Ini',
    rpg: 'Fitur *RPG* Tidak Di Nyalakan Pada Chat Ini',
    nsfw: 'Fitur *Nsfw* Tidak Di Nyalakan Pada Chat Ini',
    rowner: 'Fitur Ini Hanya Dapat Digunakan Oleh *Real Owner*',
    owner: 'Fitur Ini Hanya Dapat Digunakan Oleh *Owner*',
    ownermore: 'Fitur Ini Hanya Dapat Di Gunakan Oleh *Owner*',
    unreg: '*Kamu Belum Registrasi, Ketik .registrasi Nama|Umur*\n\n*Contoh :*\n.registrasi Modz|14'
        }[type]
        
  if (msg) return modz.sendMessage(m.chat, {
      text: msg, 
      contextInfo: {
      externalAdReply: {
      title: 'Access Denied',
      body: info.wm,
      thumbnailUrl: url.akses,
      sourceUrl: url.sid,
      mediaType: 1,
      renderLargerThumbnail: false
      }}}, { quoted: m })
             
        }

function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  let res = "Selamat Malam"
  if (time >= 4) {
    res = "Selamat Pagi"
  }
  if (time >= 10) {
    res = "Selamat Siang"
  }
  if (time >= 15) {
    res = "Selamat Sore"
  }
  if (time >= 18) {
    res = "Selamat Malam"
  }
  return res
}

function pickRandom(list) {
     return list[Math.floor(Math.random() * list.length)]
     }

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})