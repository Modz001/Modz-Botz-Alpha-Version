let modzbotz = async (m, { modz, text, args, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 10
  if (!text) return replyModz('Linknya mana?\nContoh: .ytmp4 https://youtu.be/xxxx')

  try {
    let res = await fetch(`https://zennz-api.vercel.app/api/downloader/ytmp4?url=${encodeURIComponent(text)}`)
    let json = await res.json()

    if (!json.status || !json.data?.url) {
      return replyModz('Gagal mengambil video. Pastikan link YouTube valid.')
    }

    let { title, url } = json.data
    await modz.sendMessage(m.chat, {
      video: { url },
      caption: `✅ *Berhasil Mengunduh Video YouTube*\n\n📌 *Judul:* ${title}`
    }, { quoted: m })
    replyModz(`Limit -10\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (e) {
    console.error(e)
    replyModz('Terjadi kesalahan saat mengunduh video.')
  }
}

modzbotz.help = ['ytmp4 <link>']
modzbotz.tags = ['downloader']
modzbotz.command = ['ytmp4']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz