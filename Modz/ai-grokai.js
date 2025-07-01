import axios from 'axios'

let modzbotz = async (m, { text, command, usedPrefix, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 3;
  }
  if (!text) return await replyModz(`*Contoh :*\n${usedPrefix + command} Siapa Presiden 2025 Indonesia`)

  try {
    const res = await axios.get(`https://zenz.biz.id/ai/grok3?prompt=${encodeURIComponent(text)}`)
    const result = res?.data?.result
    if (!result) return await replyModz('Gagal Mendapatkan Jawaban Dari Grok')

    await replyModz(`${result}`)
    replyModz(`Limit -3\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
  } catch (e) {
    console.error(e)
    await replyModz('Terjadi Kesalahan Saat Mengakses API Grok')
  }
}

modzbotz.help = ['grokai <pertanyaan>']
modzbotz.tags = ['ai']
modzbotz.command = /^grokai$/i
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz