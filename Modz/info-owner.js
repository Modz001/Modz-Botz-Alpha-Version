import { proto, generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

let modzbotz = async (m, { modz }) => {
let pan = `
❆═━┅━━━━━━━━━━━━━┅━═❆
> *Nomor Owner Dan Bot Ada Di Bawah Ini!*
❆═━┅━━━━━━━━━━━━━┅━═❆
`;
const url = { url: 'https://files.catbox.moe/8381kq.jpg' }
async function image(url) {
  const { imageMessage } = await generateWAMessageContent({
    image: {
      url
    }
  }, {
    upload: modz.waUploadToServer
  });
  return imageMessage;
}
let msg = generateWAMessageFromContent(
  m.chat,
  {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: pan
          },
          carouselMessage: {
            cards: [
              {
                header: proto.Message.InteractiveMessage.Header.create({
          ...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/8381kq.jpg' } }, { upload: modz.waUploadToServer })),
          title: ``,
          gifPlayback: true,
          subtitle: ``,
          hasMediaAttachment: false
        }),
                body: {
                  text: `
❆═━┅━━━━━━━━━━━━┅━═❆
        *『 \`𝗡𝗢𝗠𝗢𝗥 𝗢𝗪𝗡𝗘𝗥\` 』*
╔━┅━━━━━━━━━━━━━┅━═❆
╠━═『 *${info.namaowner}* 』═━═❆
┃ *⌬ Gunakan Bahasa Yg Sopan*
┃ *⌬ Jangan Telpon/Call Owner*
┃ *⌬ Chat Jika Ada Keperluan*
┃ *⌬ Dilarang Bug Owner!*
╠━┅━━━━━━━━━━━━━┅━═❆
╠━═『 *${info.namaowner} Store* 』═━━━═❆
┃ *⌬ Panel Pterodactyl*
┃ *⌬ Jasa Rename Sc*
╚━┅━━━━━━━━━━━━━┅━═❆`
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Chat Owner ${info.namaowner}","url":"https://wa.me/${info.nomorowner}","merchant_url":"https://wa.me/${info.nomorowner}"}`
                    },
                  ],
                },
              },
              {
                header: proto.Message.InteractiveMessage.Header.create({
          ...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/8381kq.jpg' } }, { upload: modz.waUploadToServer })),
          title: ``,
          gifPlayback: true,
          subtitle: ``,
          hasMediaAttachment: false
        }),
                body: {
                  text: `
❆═━┅━━━━━━━━━━━━┅━═❆
          *『 \`𝗡𝗢𝗠𝗢𝗥 𝗕𝗢𝗧\` 』*
╔━┅━━━━━━━━━━━━━┅━═❆
╠━═『 *${info.namabot}* 』═━═❆
┃ *⌬ Jangan Spam Bot*
┃ *⌬ Jangan Telpon/Call Bot*
┃ *⌬ Ga Ush Chat Yg Aneh-Aneh*
┃ *⌬ Dilarang Bug Bot!*
╚━┅━━━━━━━━━━━━━┅━═❆`
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Chat ${info.namabot}","url":"https://wa.me/${info.nomorbot}","merchant_url":"https://wa.me/${info.nomorbot}"}`
                    },
                  ],
                },
              },
            ],
            messageVersion: 1,
          },
        },
      },
    },
  },
  {}
);

await modz.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id,
});

}

modzbotz.help = ['owner']
modzbotz.tags = ['info']
modzbotz.command = ['owner', 'creator']

export default modzbotz