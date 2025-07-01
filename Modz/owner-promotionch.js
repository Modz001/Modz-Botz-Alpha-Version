import fs from 'fs'

const dbPath = './lib/database/promotionch.json'
let channelList = []
if (fs.existsSync(dbPath)) {
    try {
        channelList = JSON.parse(fs.readFileSync(dbPath))
    } catch {
        channelList = []
    }
}

let modzbotz = async (m, { modz, args, command }) => {
    if (!channelList.length) return await replyModz('Tidak Ada Channel Tujuan Dalam Database')

    if (!args[0] && !m.quoted) return await replyModz(`*Kirim Teks Atau Reply Media*\n\n*Contoh :*.${command} Teks/Media`)

    try {
        if (args[0]) {
            for (let id of channelList) {
                await modz.sendMessage(id, { text: args.join(' ') })
            }
            return await replyModz('Pesan Berhasil Dikirim Ke Semua Channel')
        }

        if (m.quoted) {
            let mime = (m.quoted.msg || m.quoted).mimetype || ''
            const media = await m.quoted.download()

            for (let id of channelList) {
                if (/image/.test(mime)) {
                    await modz.sendMessage(id, { image: media, caption: '' })
                } else if (/video/.test(mime)) {
                    await modz.sendMessage(id, { video: media, caption: '' })
                } else if (/pdf|officedocument|zip|rar/.test(mime)) {
                    await modz.sendMessage(id, {
                        document: media,
                        fileName: m.quoted.msg.fileName || 'file',
                        mimetype: mime,
                        caption: ''
                    })
                } else {
                    return await replyModz('Media Tidak Didukung')
                }
            }
            return await replyModz('Media Berhasil Dikirim Ke Semua Channel')
        }
    } catch (err) {
        console.error(err)
        await replyModz('Gagal Mengirim Pesan')
    }
}

modzbotz.help = ['promotionch <teks/reply media>']
modzbotz.tags = ['owner']
modzbotz.command = /^promotionch$/i
modzbotz.ownermore = true

export default modzbotz