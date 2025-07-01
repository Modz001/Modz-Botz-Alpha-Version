let modzbotz = async (m, { modz, text }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 5
  }
  if (!text.includes('|')) {
    return await replyModz(`*Contoh :*\n.fakecall Pacar Aku|11:22|https://telegra.ph/file/xxxxx.jpg`)
  }
 
  let [name, duration, avatar] = text.split('|').map(v => v.trim())
  if (!name || !duration || !avatar) return await replyModz('Semua Parameter Wajib Di Isi!')
 
  let api = `https://velyn.biz.id/api/maker/calling?name=${encodeURIComponent(name)}&duration=${encodeURIComponent(duration)}&avatar=${encodeURIComponent(avatar)}&apikey=velyn`
 
  try {
    let res = await fetch(api)
    if (!res.ok) throw await res.text()
 
    let buffer = await res.arrayBuffer()
    await modz.sendMessage(m.chat, {
  image: Buffer.from(buffer),
  caption: 'Berhasil'
}, { quoted: m })
    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (err) {
    console.error(err)
    await replyModz('Gagal Membuat Fake Call. Pastikan Parameter Valid Atau Coba Lagi Nanti.')
  }
}
 
modzbotz.command = ['fakecall']
modzbotz.help = ['fakecall <name>|<duration>|<avatar>']
modzbotz.tags = ['maker']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz