import fetch from 'node-fetch';
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

const modzbotz = async (m, { text, modz, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
    global.limits -= 3;
  }
  if (!text) return await replyModz(`*Contoh :*\n.pin Robot`);

  try {
    const res = await fetch(`https://vor-apis.biz.id/api/pin?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.length) {
      return await replyModz('Tidak Ditemukan Hasil');
    }

    const data = json.data[Math.floor(Math.random() * json.data.length)];
    const caption = `*『 Pinterest Search 』*\n` +
                    `*⌬ Author :* ${data.upload_by}\n` +
                    `*⌬ Caption :* ${data.caption}\n` +
                    `*⌬ Source :* ${data.source}`;

    const media = await prepareWAMessageMedia(
      { image: { url: data.image } },
      { upload: modz.waUploadToServer }
    );

    const message = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: {
            body: { text: caption },
            footer: { text: '© Modz Botz | Pinterest' },
            header: {
              hasMediaAttachment: true,
              imageMessage: media.imageMessage,
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: `{\"display_text\":\"Next\",\"id\":\".pin ${text}\"}`
                }
              ]
            }
          }
        }
      }
    }, { quoted: m });

    await modz.relayMessage(m.chat, message.message, { messageId: message.key.id });

    replyModz(`Limit -3\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
  } catch (err) {
    console.log(err);
    await replyModz('Terjadi Kesalahan Saat Mengambil Data Dari Pinterest');
  }
};

modzbotz.help = ['pin <keyword>'];
modzbotz.tags = ['internet'];
modzbotz.command = ['pin', 'pinterest'];
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;