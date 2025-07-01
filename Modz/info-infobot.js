import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

let modzbotz = async (m, { modz }) => {
let info = `Informasi Tentang Modz Botz Alpha Version. Modz Botz Adalah Bot Yang Di Kembangkan Oleh Z Dev Dari Base Bot Milik Jarsepay, Karena Masih Alpha Version Modz Botz Baru Memiliki Sedikit Fitur\nTetapi Modz Botz Sudah Memiliki Beberapa Fungsi, Seperti Fungsi Limit, Fungsi Pesan Welcome, Left, Promote, Demote, Dll\nUntuk Limit Diharapkan Untuk Para Pengguna Biasa Menggunakan Fitur Dengan Bijak Agar Limit Tidak Cepat Habis. Jika Limit Habis Kamu Bisa Tunggu Selama 24 Jam/Beli Premium Ke Owner Dengan Harga Murah. Untuk Cek Limit Ketik .ceklimit\n\nHanya Ini Saja Informasi Tentang Modz Botz, Terimakasih`

    const media = await prepareWAMessageMedia(
      { image: { url: 'https://files.catbox.moe/d8yovi.jpg' } },
      { upload: modz.waUploadToServer }
    );

    const message = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: {
            body: { text: '*『 Modz Botz Information 』*\n\n' + info },
            footer: { text: '© Modz Botz | Pinterest' },
            header: {
              hasMediaAttachment: true,
              imageMessage: media.imageMessage,
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: `{\"display_text\":\"Credit\",\"id\":\".creditbot\"}`
                },
                {
                  name: "cta_url",
                  buttonParamsJson: "{\"display_text\":\"Owner Modz\",\"url\":\"https://wa.me/6283163234218\",\"merchant_url\":\"https://www.google.com\"}"
                },
                {
                  name: "cta_url",
                  buttonParamsJson: "{\"display_text\":\"Modz Web\",\"url\":\"https://modzweb.vercel.app\",\"merchant_url\":\"https://www.google.com\"}"
                }
              ]
            }
          }
        }
      }
    }, { quoted: m })

    await modz.relayMessage(m.chat, message.message, { messageId: message.key.id })
}

modzbotz.help = ['infobot']
modzbotz.tags = ['info']
modzbotz.command = ['infobot']

export default modzbotz