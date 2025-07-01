import sendImageAsSticker from '../lib/sendImageAsSticker.js'

let modzbotz = async (m, { modz, text, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 2
  }
  if (!text) return await replyModz("*Contoh :*\nBrat Hai Apa Kabar?")

  const url = `https://apizell.web.id/tools/bratanimate?q=${encodeURIComponent(text)}`
  await sendImageAsSticker(modz, m.chat, url, m, {
    packname: info.stickpack,
    author: info.stickauth
  })
  replyModz(`Limit -2\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
}

modzbotz.help = ["bratvid <text>"]
modzbotz.tags = ["sticker"]
modzbotz.command = ["bratvid"]
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz