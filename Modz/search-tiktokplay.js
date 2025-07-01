import fetch from 'node-fetch'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

const modzbotz = async (m, { modz, usedPrefix, command, text, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 5
  }
  if (!text) return await replyModz(`*Contoh :* ${usedPrefix + command} AI`)

  try {
    const res = await fetch(`https://apizell.web.id/download/tiktokplay?q=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status || !json.data || !json.data.length) {
      return await replyModz('Video Tidak Ditemukan')
    }

    const vid = json.data[0]
    const caption = `*『 TikTok Play 』*
*⌬ Title :* ${vid.title}
*⌬ Author :* ${vid.author}
*⌬ Views :* ${vid.views.toLocaleString()}`

    const media = await prepareWAMessageMedia(
      { video: { url: vid.url }, gifPlayback: false },
      { upload: modz.waUploadToServer }
    )

    const message = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: {
            body: { text: caption },
            footer: { text: '© Modz Botz | TikTok' },
            header: {
              hasMediaAttachment: true,
              videoMessage: media.videoMessage,
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: `{\"display_text\":\"Next\",\"id\":\"playtiktok ${text}, Lanjut\"}`
                }
              ]
            }
          }
        }
      }
    }, { quoted: m })

    await modz.relayMessage(m.chat, message.message, { messageId: message.key.id })

    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (e) {
    console.error(e)
    await replyModz('Gagal Memproses Video TikTok')
  }
}

modzbotz.help = ['tiktokplay <query>']
modzbotz.tags = ['search']
modzbotz.command = ['tiktokplay', 'ttplay']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz