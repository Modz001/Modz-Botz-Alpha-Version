import axios from 'axios'
import FormData from 'form-data'

async function uploadMedia(buffer, filename) {
  const form = new FormData()
  form.append('file', buffer, filename)
  const { data } = await axios.post('https://cdn.vioo.my.id/upload', form, {
    headers: { ...form.getHeaders(), Accept: 'application/json' }
  })
  return data
}

let modzbotz = async (m, { modz, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 5
  }
  try {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''
    if (!mime) throw '*Contoh :*\n.tourlvio Reply Media Yang Mau Di Upload'

    await await replyModz('Uploading...')
    const buffer = await q.download()
    if (buffer.length > 50 * 1024 * 1024) throw 'Max Size 50MB'

    const ext = mime.split('/')[1]
    const filename = `Upload_${Date.now()}.${ext}`
    const result = await uploadMedia(buffer, filename)

    await replyModz(result?.data?.url || 'Gagal Mendapatkan URL')
    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (e) {
    console.error(e)
    await replyModz(`${e?.message || e}`)
  }
}

modzbotz.help = ['tourlvio <gambar>']
modzbotz.tags = ['tools']
modzbotz.command = ['tourlvio']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz