import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';

const modzbotz = async (m, { conn, command, usedPrefix, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 5
  }
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) {
    return conn.sendMessage(m.chat, {
      text: `*Contoh :*\nReply Gambar Dengan Caption ${usedPrefix + command}`,
    }, { quoted: m })
  }

  // Download media
  const media = await q.download()
  const tempDir = './temp'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

  const ext = mime.split('/')[1] || 'dat'
  const fileName = `media_${Date.now()}.${ext}`
  const filePath = path.join(tempDir, fileName)
  fs.writeFileSync(filePath, media)

  const buffer = fs.readFileSync(filePath)


  // Upload ke berbagai hosting
  const uploadToSupa = async (buffer) => {
    try {
      const form = new FormData()
      form.append('file', buffer, 'upload.jpg')
      const res = await axios.post('https://i.supa.codes/api/upload', form, {
        headers: form.getHeaders()
      })
      return res.data?.link || null
    } catch (err) {
      console.error('Supa Error :', err?.response?.data || err.message)
      return null
    }
  }

  const uploadToTmpFiles = async (filePath) => {
    try {
      const buf = fs.readFileSync(filePath)
      const { ext, mime } = await fileTypeFromBuffer(buf)
      const form = new FormData()
      form.append('file', buf, {
        filename: `${Date.now()}.${ext}`,
        contentType: mime
      })
      const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
        headers: form.getHeaders()
      })
      return res.data.data.url.replace('s.org/', 's.org/dl/')
    } catch (err) {
      console.error('TmpFiles Error :', err)
      return null
    }
  }

  const uploadToUguu = async (filePath) => {
    try {
      const form = new FormData()
      form.append('files[]', fs.createReadStream(filePath))
      const res = await axios.post('https://uguu.se/upload.php', form, {
        headers: form.getHeaders()
      })
      return res.data.files?.[0]?.url || null
    } catch (err) {
      console.error('Uguu Error :', err)
      return null
    }
  }

  const uploadToFreeImageHost = async (buffer) => {
    try {
      const form = new FormData()
      form.append('source', buffer, 'file')
      const res = await axios.post('https://freeimage.host/api/1/upload', form, {
        params: {
          key: '6d207e02198a847aa98d0a2a901485a5' // Ganti jika limit/habis
        },
        headers: form.getHeaders()
      })
      return res.data.image.url
    } catch (err) {
      console.error('FreeImageHost Error:', err?.response?.data || err.message)
      return null
    }
  }

  const [supa, tmp, uguu, freehost] = await Promise.all([
    uploadToSupa(buffer),
    uploadToTmpFiles(filePath),
    uploadToUguu(filePath),
    uploadToFreeImageHost(buffer),
  ])

  let Info = '*Berhasil Upload Ke Beberapa Layanan :*\n\nSupa\nTmpFiles\nUguu\nFreeImage.Host'

     const message = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: {
            body: { text: Info },
            footer: { text: '© Modz Botz' },
            header: {
              hasMediaAttachment: false,
              imageMessage: media.imageMessage
            },
        nativeFlowMessage: {
          buttons: [
             {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "Supa",
                    copy_code: supa
                })
            },
            {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "TmpFiles",
                    copy_code: tmp
                })
            },
            {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "Uguu",
                    copy_code: uguu
                })
            },
            {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "FreeImage.Host",
                    copy_code: freehost
                })
            }
          ]
        }
      }
    }
  }
}, { quoted: m });

await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });

  fs.unlinkSync(filePath)

  replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
}

modzbotz.help = ['tourlmulti <gambar>']
modzbotz.tags = ['tools']
modzbotz.command = /^(tourlmulti|uploadmulti)$/i
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz