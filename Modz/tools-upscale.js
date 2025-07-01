import fetch from 'node-fetch'
import FormData from 'form-data'

let modzbotz = async (m, { modz, usedPrefix, command, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 5
  }
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || quoted.msg?.mimetype || ''

  if (!/image\/(jpe?g|png)/i.test(mime)) {
    return await replyModz(`Kirim/Reply Gambar-Nya!`)
  }

  try {
    const media = await quoted.download()
    const ext = mime.split('/')[1]
    const filename = `upscaled_${Date.now()}.${ext}`

    const form = new FormData()
    form.append('image', media, { filename, contentType: mime })
    form.append('scale', '2')

    const headers = {
      ...form.getHeaders(),
      'accept': 'application/json',
      'x-client-version': 'web',
      'x-locale': 'en'
    }

    const res = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
      method: 'POST',
      headers,
      body: form
    })

    const json = await res.json()

    if (!json?.result_url || !json.result_url.startsWith('http')) {
      throw new Error('Gagal Mendapatkan URL Hasil Dari Pixelcut')
    }

    const resultBuffer = await (await fetch(json.result_url)).buffer()

    await modz.sendMessage(m.chat, {
      image: resultBuffer,
      caption: `Resolusi Gambar Berhasil Di Tingkatkan!`.trim()
    }, { quoted: m })
    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (err) {
    await replyModz(`Upscaling Gagal :\n${err.message || err}`)
  }
}

modzbotz.help = ['hd <gambar>']
modzbotz.tags = ['tools']
modzbotz.command = ['hd']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz