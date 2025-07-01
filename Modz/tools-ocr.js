import axios from 'axios'
import FormData from 'form-data'

async function uploadUguu(buffer, filename) {
  const form = new FormData()
  form.append('files[]', buffer, filename)

  const { data } = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders()
  })

  if (data?.files?.[0]?.url) return data.files[0].url
  throw new Error('Upload Gagal')
}

let modzbotz = async (m, { modz, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
    global.limits -= 2
  }
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!mime.startsWith('image/')) throw '*Contoh :*\n.ocr Kirim/Reply Gambar'

    const buffer = await q.download()
    const ext = mime.split('/')[1]
    const filename = `ocr.${ext}`

    const imageUrl = await uploadUguu(buffer, filename)
    const { data } = await axios.get(
      `https://www.abella.icu/ocr?imageUrl=${encodeURIComponent(imageUrl)}`
    )

    if (data?.status !== 'success') throw 'OCR Gagal, Coba Lagi Nanti'

    const hasil = data?.data?.extractedText || 'Tidak Ada Teks Yang Berhasil Diekstrak'
    await replyModz(hasil.replace(/\r/g, ''))
    replyModz(`Limit -2\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (err) {
    console.error(err)
    await replyModz(`${err}`)
  }
}

modzbotz.command = ['ocr <gambar>']
modzbotz.tags = ['tools']
modzbotz.help = ['ocr']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz