import { createCanvas, loadImage } from 'canvas'
import fetch from 'node-fetch'

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 10000 } = options
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(resource, { ...options, signal: controller.signal })
  clearTimeout(id)
  return response
}

const modzbotz = async (m, { modz, args, usedPrefix, command, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 5;
  }
  if (!args[0]) return await replyModz(`*Contoh :* ${usedPrefix + command} Katyusha`)
  const query = args.join(' ')

  let json
  try {
    const res = await fetchWithTimeout(`https://zenzzx-api.vercel.app/search/youtube?q=${encodeURIComponent(query)}`)
    json = await res.json()
  } catch (err) {
    return await replyModz('Gagal Menghubungi Server Utama. Coba Lagi Nanti')
  }

  if (!json?.result?.length) return await replyModz('Gagal Mengambil Data')

  const top = json.result[0]
  const { title, channel, duration, imageUrl, link } = top
  const resImg = await fetch(imageUrl)
  const img = await loadImage(Buffer.from(await resImg.arrayBuffer()))

  const canvas = createCanvas(800, 400)
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, '#121212')
  gradient.addColorStop(1, '#1f1f1f')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(img, 40, 80, 240, 240)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px Sans'
  const lines = []
  const words = title.split(' ')
  let line = ''
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > 400 && i > 0) {
      lines.push(line)
      line = words[i] + ' '
    } else {
      line = testLine
    }
  }
  lines.push(line)
  lines.forEach((l, i) => {
    ctx.fillText(l.trim(), 310, 150 + i * 35)
  })

  ctx.fillStyle = '#b3b3b3'
  ctx.font = '24px Sans'
  ctx.fillText(channel, 310, 240)
  ctx.fillText(duration, 310, 270)

  ctx.fillStyle = '#555'
  ctx.fillRect(310, 300, 400, 6)

  ctx.fillStyle = '#1db954'
  ctx.fillRect(310, 300, 150, 6)

  const buffer = canvas.toBuffer('image/png')

  await modz.sendMessage(m.chat, {
    image: buffer,
    caption: `*『 YouTube Play 』*\n\n*⌬ Judul :* ${title}\n*⌬ Channel :* ${channel}\n*⌬ Durasi :* ${duration}`,
    contextInfo: {
      externalAdReply: {
        title,
        body: `${channel} • ${duration}`,
        thumbnailUrl: imageUrl,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: link
      },
      businessMessageForwardInfo: {
        businessOwnerJid: modz.decodeJid(modz.user.id)
      },
      forwardedNewsletterMessageInfo: {
        newsletterName: "Downloader Musik",
        newsletterJid: "0@newsletter"
      },
      forwardingScore: 9999,
      isForwarded: false
    },
    buttons: [
      { buttonId: `.ytmp3 ${link}`, buttonText: { displayText: 'Audio | Mp3' }, type: 1 },
      { buttonId: `.ytmp4 ${link}`, buttonText: { displayText: 'Video | Mp4' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m })
  replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
}

modzbotz.command = ['youtubeplay', 'ytplay']
modzbotz.tags = ['search']
modzbotz.help = ['youtubeplay <query>']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz