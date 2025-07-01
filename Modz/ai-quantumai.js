import fetch from 'node-fetch';

let modzbotz = async (m, { text, command, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
    global.limits -= 3
}
  if (!text) return await replyModz(`*Contoh :*\n.${command} Apa Itu Kecerdasan Buatan?`)

  try {
    const api = `https://zelapioffciall.vercel.app/ai/quantum?text=${encodeURIComponent(text)}`
    const res = await fetch(api)
    if (!res.ok) throw await res.text()
    
    const json = await res.json()
    if (!json.result) return await replyModz('Gagal Mendapatkan Respon Dari AI')

    await replyModz(json.result)
    replyModz(`Limit -3\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (e) {
    console.error('Error : ', e)
    await replyModz('Terjadi Kesalahan Saat Mengambil Respon Dari Quantum AI')
  }
}

modzbotz.help = ['quantumai <pertanyaan>']
modzbotz.tags = ['ai']
modzbotz.command = ['quantumai']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz