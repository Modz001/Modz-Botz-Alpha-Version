import sendImageAsSticker from '../lib/sendImageAsSticker.js'
import axios from "axios"

const warna = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFFF33",
  "#33FFF0", "#FF8C33", "#A833FF", "#33FFBD", "#FF3333",
  "#1C1C1C", "#2C3E50", "#34495E", "#4B0082", "#2E2E2E",
  "#3B3B3B", "#1B2631", "#0B0C10", "#2F4F4F", "#191970",
  "#AEC6CF", "#FFD1DC", "#B0E0E6", "#FFFACD", "#E0BBE4",
  "#C1F0F6", "#FDDDE6", "#39FF14", "#FF073A", "#FE019A",
  "#0FF0FC", "#FFFF33", "#FF5F1F", "#FF0000", "#00FF00",
  "#0000FF", "#800080", "#808080"
]

let modzbotz = async (m, { modz, text, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 1
  }
  if (!text) return await replyModz("*Contoh :*\nQc Hai")
  if (text.length > 10000) return await replyModz("Maximal 10000 karakter!")

  const reswarna = warna[Math.floor(Math.random() * warna.length)]

  let profilePic
  try {
    profilePic = await modz.profilePictureUrl(m.sender, "image")
  } catch {
    profilePic = "https://i.ibb.co/3Fh9V6p/avatar-contact.png"
  }

  const payload = {
    type: "quote",
    format: "png",
    backgroundColor: reswarna,
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: m.pushName,
          photo: { url: profilePic },
        },
        text: text,
        replyMessage: {},
      },
    ],
  }

  try {
    const response = await axios.post("https://bot.lyo.su/quote/generate", payload, {
      headers: { "Content-Type": "application/json" },
    })

    const imageBuffer = Buffer.from(response.data.result.image, "base64")

    await sendImageAsSticker(modz, m.chat, imageBuffer, m, {
      packname: info.stickpack,
      author: info.stickauth,
    })
    replyModz(`Limit -1\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
  } catch (err) {
    await replyModz("❌ Gagal membuat quote. Coba lagi nanti.")
    console.error("Error generate QC:", err)
  }
}

modzbotz.help = ["qc <text>"]
modzbotz.tags = ["sticker"]
modzbotz.command = ["qc"]
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz