import sendImageAsSticker from '../lib/sendImageAsSticker.js'

let modzbotz = async (m, { modz, text, isPrem }) => {
   if (!isPrem) {
   if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
    global.limits -= 1
  }
  if (!text) return await replyModz("*Contoh :*\nBrat Hai")

  const url = `https://apizell.web.id/tools/brat?q=${encodeURIComponent(text)}`
  await sendImageAsSticker(modz, m.chat, url, m, {
    packname: info.stickpack,
    author: info.stickauth
  })
    replyModz(`Limit -1\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
}

modzbotz.help = ["brat <text>"]
modzbotz.tags = ["sticker"]
modzbotz.command = ["brat"]
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz