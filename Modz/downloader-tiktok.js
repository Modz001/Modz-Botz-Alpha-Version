import axios from 'axios'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { fetchJson } from '../lib/myfunc.js'

const ModzTTDL = async (videoUrl) => {
  try {
    const endpoint = "https://ssstik.io/abc?url=dl"
    const requestData = new URLSearchParams({
      id: videoUrl,
      locale: "id",
      tt: "VktkdWY4",
    })

    const headers = {
      "HX-Request": "true",
      "HX-Trigger": "gcaptchapt",
      "HX-Target": "target",
      "HX-Current-URL": "https://ssstik.io/id",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    }

    const response = await axios.post(endpoint, requestData.toString(), { headers })
    const $ = cheerio.load(response.data)

    const title = $("h2").text().trim() || "Judul Tidak Tersedia"
    const description = $(".maintext").text().trim() || "Deskripsi tidak tersedia"
    const downloadLink = $(".downloadlink.withoutwatermark").attr("href") || null
    const hdDownloadLink = $(".downloadlink.withoutwatermarkhd").attr("href") || null

    return { title, description, downloadLink, hdDownloadLink }
  } catch (error) {
    return { error: error.message }
  }
}

let modzbotz = async (m, { modz, usedPrefix, args, command, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 5
  }
  const text = args[0]
  if (!text) return await replyModz(`*Masukkan Link-Nya*\n\n*Contoh :*\n${usedPrefix + command} https://vt.tiktok.com/xxx`)

  try {
    const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(text)}`)
    if (!res.ok) throw 'Gagal Mengambil Data!'
    const json = await res.json()

  if (json.images && json.images.length > 0) {
  if (m.isGroup) {
    await await replyModz('Gambar Telah Dikirim Ke Private Chat Kamu, Silahkan Cek!')

    for (let img of json.images) {
      await modz.sendMessage(m.sender, {
        image: { url: img.url },
        caption: `*⌬ Judul :* ${json.title}`
      }, { quoted: m })
    }
  } else {
    await await replyModz('Berikut Gambarnya...')

    for (let img of json.images) {
      await modz.sendMessage(m.chat, {
        image: { url: img.url },
        caption: `*⌬ Judul :* ${json.title}`
      }, { quoted: m })
    }
  }
} else if (json.video?.noWatermark) {
      const caption = `*『 TikTok Downloader 』*
*⌬ Video Dari :* ${json.author?.name ?? 'Tidak Diketahui'} (@${json.author?.uniqueid ?? 'Tidak Diketahui'})
*⌬ Likes :* ${json.stats?.likeCount ?? 'Tidak Diketahui'}
*⌬ Comments :* ${json.stats?.commentCount ?? 'Tidak Diketahui'}
*⌬ Shares :* ${json.stats?.shareCount ?? 'Tidak Diketahui'}
*⌬ Plays :* ${json.stats?.playCount ?? 'Tidak Diketahui'}
*⌬ Saves :* ${json.stats?.saveCount ?? 'Tidak Diketahui'}
*⌬ Title :* ${json.title ?? 'Tidak Diketahui'}

⏤͟͟͞͞Downloader By 『 ${info.namabot} 』`

      await modz.sendMessage(m.chat, {
        video: { url: json.video.noWatermark },
        caption,
      }, { quoted: m })

    } else {
      const nyut = await ModzTTDL(text)
      if (nyut?.error || (!nyut.downloadLink && !nyut.hdDownloadLink)) {
        return await replyModz("Gagal Mengambil Video Dari TikTok (API & Fallback Gagal)")
      }

      await modz.sendMessage(m.chat, {
        caption: `*『 TikTok Downloader 』*\n*⌬ Judul :* ${nyut.title}\n*⌬ Deskripsi :* ${nyut.description}`,
        video: { url: nyut.hdDownloadLink || nyut.downloadLink },
      }, { quoted: m })
    }
    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (err) {
    console.error(err)
    await replyModz('Maaf, terjadi kesalahan saat memproses permintaan.')
  }
}

modzbotz.help = ['tiktok <link>']
modzbotz.tags = ['downloader']
modzbotz.command = ['tiktok', 'tt']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz