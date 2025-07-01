import './system/config.js'
import path, { join } from 'path'
import { platform } from 'process'
import chalk from 'chalk'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

import * as ws from 'ws'
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import os from 'os'
import Pino from 'pino'
import { format } from 'util'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low } from 'lowdb'
import fs from 'fs'
import { JSONFile } from "lowdb/node"
import storeSys from './lib/store2.js'
import { checkSewaExpiration } from './lib/sewaChecker.js'
const store = storeSys.makeInMemoryStore()
const {
    DisconnectReason,
    useMultiFileAuthState,
    MessageRetryMap,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    proto,
    jidNormalizedUser,
    PHONENUMBER_MCC,
    Browsers
} = await (await import('@whiskeysockets/baileys')).default

import readline from "readline"
import { parsePhoneNumber } from "libphonenumber-js"

const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
import NodeCache from "node-cache"
const msgRetryCounterCache = new NodeCache()
const msgRetryCounterMap = (MessageRetryMap) => {}
const {
    version
} = await fetchLatestBaileysVersion()


protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query,
    ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
})) : '')

global.timestamp = {
    start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎!./#\\').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}modzbotz/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise((resolve) => setInterval(async function() {
        if (!global.db.READ) {
            clearInterval(this)
            resolve(global.db.data == null ? await global.loadDatabase() : global.db.data)
        }
    }, 1 * 1000))
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        menfess: {},
        simulator: {},
        ...(global.db.data || {})
    }
    global.db.chain = chain(global.db.data)
}
loadDatabase()

global.authFolder = storeSys.fixFileName(`${opts._[0] || ''}modzbotz/sessions`)
let {
    state,
    saveCreds
} = await useMultiFileAuthState(path.resolve('./modzbotz/sessions'))

const connectionOptions = {
    pairingCode: true,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage)
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {}
                        },
                        ...message
                    }
                }
            }
        }
        return message
    },
    msgRetryCounterMap,
    logger: Pino({
        level: 'fatal'
    }),
    auth: state,
    browser: ['Mac OS', 'safari', '5.1.10'],
    version,
    getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)
        return msg?.message || ""
    },
    msgRetryCounterCache,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true
}

global.modz = makeWASocket(connectionOptions)
modz.isInit = false
global.pairingCode = true

let _welcome = JSON.parse(fs.readFileSync('./lib/database/welcome.json'))
let _left = JSON.parse(fs.readFileSync('./lib/database/left.json'))

import { welcome } from './lib/welcome.js'

modz.ev.on('group-participants.update', async (anu) => {
  const iswel = _welcome.includes(anu.id)
  const isleft = _left.includes(anu.id)
  await welcome(iswel, isleft, modz, anu, setting)
})

modz.ev.on('group-participants.update', update => groupParticipantsUpdate(modz, update))

const usePairingCode = !process.argv.includes('--use-pairing-code')
const useMobile = process.argv.includes('--mobile')

if (usePairingCode && !modz.authState.creds.registered) {
    if (useMobile) throw new Error('Cannot use pairing code with Mobile API')
        const { registration } = { registration: {} }
    let phoneNumber = global.info.pairingNumber
    console.log(chalk.bgWhite(chalk.blue('Generating code...')))
    setTimeout(async () => {
        let code = await modz.requestPairingCode(phoneNumber, "MODZBOTZ");
        code = code?.match(/.{1,4}/g)?.join('-') || code
        console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
    }, 3000)
}

if (!opts['test']) {
    if (global.db) {
        setInterval(async () => {
            if (global.db.data) await global.db.write().catch(console.error)
            clearTmp()
        }, 30 * 1000)
    }
}

const directory = './modzbotz/sessions'

function deleteFilesExceptOne(directory, fileNameToKeep) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Terjadi kesalahan: ', err)
            return
        }

        files.forEach((file) => {
            const filePath = path.join(directory, file)
            if (file !== fileNameToKeep) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Gagal menghapus file ${file}:`, err)
                    } else {
                        console.log(`File ${file} berhasil dihapus.`)
                    }
                })
            }
        })
    })
}

function clearTmp() {
    const tmp = [tmpdir(), join(__dirname, './tmp')]
    const filename = []
    tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))))
    return filename.map((file) => {
        const stats = statSync(file)
        if (stats.isFile() && (Date.now() - stats.mtimeMs >= 5 * 60 * 1000)) return unlinkSync(file)
        return false
    })
}

let isCheckerActive = false

async function connectionUpdate(update) {
    const {
        connection,
        lastDisconnect,
        isNewLogin
    } = update
    global.stopped = connection

    if (isNewLogin) modz.isInit = true
    const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
    if (code && code !== DisconnectReason.loggedOut && modz?.ws.readyState !== ws.default.CONNECTING) {
        console.log(await global.reloadHandler(true).catch(console.error))
        global.timestamp.connect = new Date
    }
    if (global.db.data == null) loadDatabase()
    if (connection === "open") {
        console.log(chalk.bgGreen(chalk.black(`💃 ${info.namabot} telah aktif`)))

        // --- MULAI PENAMBAHAN KODE DI SINI ---
        if (!isCheckerActive) {
            console.log("Mengaktifkan Sewa Checker, akan memeriksa setiap 1 menit.")
            setInterval(() => {
                checkSewaExpiration(modz)
            }, 60 * 1000) // 60 * 1000 milidetik = 1 menit
            isCheckerActive = true // Tandai bahwa checker sudah aktif
        }
        // --- SELESAI PENAMBAHAN KODE ---

    }
    if (connection == 'close') {
        console.log(chalk.yellow(`Koneksi bot terputus! Sedang menyambungkan ulang...`))
    }
}

process.on('uncaughtException', console.error)
let isInit = true

let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
    } catch (error) {
        console.error
    }
    if (restatConn) {
        const oldChats = global.modz.chats
        try {
            global.modz.ws.close()
        } catch {}
        modz.ev.removeAllListeners()
        global.modz = makeWASocket(connectionOptions, {
            chats: oldChats
        })
        isInit = true
    }
    if (!isInit) {
        modz.ev.off('messages.upsert', modz.handler)
        modz.ev.off('messages.update', modz.pollUpdate)
        modz.ev.off('groups.update', modz.groupsUpdate)
        modz.ev.off('connection.update', modz.connectionUpdate)
        modz.ev.off('creds.update', modz.credsUpdate)
    }

    modz.handler = handler.handler.bind(global.modz)
    modz.pollUpdate = handler.pollUpdate.bind(global.modz)
    modz.groupsUpdate = handler.groupsUpdate.bind(global.modz)
    modz.connectionUpdate = connectionUpdate.bind(global.modz)
    modz.credsUpdate = saveCreds.bind(global.modz)

    const currentDateTime = new Date()
    const messageDateTime = new Date(modz.ev)
    if (currentDateTime >= messageDateTime) {
        const chats = Object.entries(modz.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
    } else {
        const chats = Object.entries(modz.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
    }

    modz.ev.on('messages.upsert', modz.handler)
    modz.ev.on("messages.update", modz.pollUpdate)
    modz.ev.on('groups.update', modz.groupsUpdate)
    modz.ev.on('connection.update', modz.connectionUpdate)
    modz.ev.on('creds.update', modz.credsUpdate)
    isInit = false
    return true
}

const pluginFolder = global.__dirname(join(__dirname, './Modz/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.modzbotz = {}
async function filesInit() {
    for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
        try {
            const file = global.__filename(join(pluginFolder, filename))
            const module = await import(file)
            global.modzbotz[filename] = module.default || module
        } catch (e) {
            modz.logger.error(e)
            delete global.modzbotz[filename]
        }
    }
}
filesInit().then((_) => Object.keys(global.modzbotz)).catch(console.error)

global.reload = async (_ev, filename) => {
    if (pluginFilter(filename)) {
        const dir = global.__filename(join(pluginFolder, filename), true)
        if (filename in global.modzbotz) {
            if (existsSync(dir)) modz.logger.info(`Plugin Update - '${filename}'`)
            else {
                modz.logger.warn(`Plugin Dihapus - '${filename}'`)
                return delete global.modzbotz[filename]
            }
        } else modz.logger.info(`Plugin Baru - '${filename}'`)
        const err = syntaxerror(readFileSync(dir), filename, {
            sourceType: 'module',
            allowAwaitOutsideFunction: true,
        })
        if (err) modz.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
        else {
            try {
                const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
                global.modzbotz[filename] = module.default || module
            } catch (e) {
                modz.logger.error(`Error Require Plugin '${filename}\n${format(e)}'`)
            } finally {
                global.modzbotz = Object.fromEntries(Object.entries(global.modzbotz).sort(([a], [b]) => a.localeCompare(b)))
            }
        }
    }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

async function _quickTest() {
    const test = await Promise.all([
        spawn('ffmpeg'),
        spawn('ffprobe'),
        spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
        spawn('convert'),
        spawn('magick'),
        spawn('gm'),
        spawn('find', ['--version']),
    ].map((p) => {
        return Promise.race([
            new Promise((resolve) => {
                p.on('close', (code) => {
                    resolve(code !== 127)
                })
            }),
            new Promise((resolve) => {
                p.on('error', (_) => resolve(false))
            })
        ])
    }))
    const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
    const s = global.support = {
        ffmpeg,
        ffprobe,
        ffmpegWebp,
        convert,
        magick,
        gm,
        find
    }
    Object.freeze(global.support)
}

if (setting.autoclear) {
    setInterval(async () => {
        if (stopped === 'close' || !modz || !modz.user) return
        await deleteFilesExceptOne(directory, 'creds.json')
        await clearTmp()
        replyModz(info.nomorowner + '@s.whatsapp.net', 'Sesi telah dibersihkan.', null) >
            console.log(chalk.cyanBright(
                `\n╭───────────────────·»\n│\n` +
                `│  Sessions cleared Successfully \n│\n` +
                `╰───❲ ${global.namebot} ❳\n`
            ))
    }, 120 * 60 * 1000)
}

_quickTest().catch(console.error)

// Auto restart setiap 12 jam
setInterval(() => {
  console.log('⏰ Melakukan restart otomatis setelah 12 jam...');
  process.exit(0) // trigger restart jika pakai PM2, Pterodactyl, Termux loop
}, 12 * 60 * 60 * 1000) // 43_200_000 ms = 12 jam
