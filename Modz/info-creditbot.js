import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

let modzbotz = async (m, { modz }) => {
let info = `Bot Ini Dibuat Dan Dikembangkan Oleh Modz Never Die Semua Fitur Dan Sistem Yang Ada Di Bot Ini Dirancang Untuk Membantu Pengguna Dalam Berbagai Keperluan, Dari Yang Serius Sampai Yang Santai.

❆ Dibuat Oleh :
Modz Never Die | AZP | Zidan

❆ Tools Yang Dipakai :
Baileys

❆ Bahasa Pemrograman :
JavaScript

❆ Peringatan :
Dilarang Keras Untuk Menjual Script Ini

❆ Pemilik Base :
Jarsepay

❆ Terima Kasih Spesial Untuk :
➩ Jarsepay - Owner Base
➩ Modz Never Die - Developer
➩ ChatGPT - Assistent`

    const media = await prepareWAMessageMedia(
      { image: { url: 'https://files.catbox.moe/d8yovi.jpg' } },
      { upload: modz.waUploadToServer }
    );

    const message = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: {
            body: { text: '*『 Credit Modz Botz 』*\n\n' + info },
            footer: { text: '© Modz Botz | Credit' },
            header: {
              hasMediaAttachment: true,
              imageMessage: media.imageMessage,
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: "{\"display_text\":\"Github Jarsepay\",\"url\":\"https://github.com/jarsepay\",\"merchant_url\":\"https://www.google.com\"}"
                }
              ]
            }
          }
        }
      }
    }, { quoted: m })

    await modz.relayMessage(m.chat, message.message, { messageId: message.key.id })
}

modzbotz.help = ['creditbot']
modzbotz.tags = ['info']
modzbotz.command = ['credit', 'creditbot']

export default modzbotz