import fetch from 'node-fetch'

let modzbotz = async (m, { modz, text, command, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 5
  }
  if (!text) {
    return await replyModz(`Masukkan Judul Lagu!\n\n*Contoh :* .${command} Katyusha`)
  }

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`)
    const data = await res.json()

    if (!data.status || !data.result?.metadata) {
      throw 'Lagu Tidak Ditemukan Atau API Error'
    }

    const { title, artist, duration, cover, url } = data.result.metadata
    const downloadUrl = data.result.downloadUrl

    const thumbRes = await fetch(cover)
    const thumbBuffer = await thumbRes.buffer()

    await modz.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: true, // jika ingin kirim sebagai VN/audio pendek. Ubah ke false kalau mau jadi audio biasa
      contextInfo: {
        externalAdReply: {
          title: title,
          body: `${artist} • ${duration}`,
          mediaType: 2,
          thumbnail: thumbBuffer,
          sourceUrl: url || "https://open.spotify.com"
        }
      }
    }, { quoted: m })

    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (e) {
    console.error(e)
    await replyModz('Lagu Tidak Ditemukan Atau API Error')
  }
}

modzbotz.help = ['spotify <judul lagu>']
modzbotz.tags = ['downloader']
modzbotz.command = ['spotify']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz