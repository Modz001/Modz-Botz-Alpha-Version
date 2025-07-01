import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
const { proto, prepareWAMessageMedia } = (await import('@whiskeysockets/baileys')).default;

let modzbotz = async (m, { conn, command, usedPrefix, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 5;
  }
    try {
        if (m._tourl_done) return; 
        m._tourl_done = true;

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';
        if (!mime || mime === 'conversation') return await replyModz(`*Contoh :*\nReply Gambar Dengan Caption ${usedPrefix + command}`);

        let media = await q.download();
        let catboxLink = await catboxUpload(media).catch(() => null);

        if (!catboxLink) throw new Error('Gagal Mengunggah File Ke Catbox');

        let caption = `*Uploader Sukses\n*
Klik Tombol Dibawah Ini Untuk Menyalin Url`;

        let thumbnail = await prepareWAMessageMedia(
            { image: { url: catboxLink } },
            { upload: conn.waUploadToServer }
        );

        let buttons = [
            {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "Salin",
                    copy_code: catboxLink
                })
            }
        ];

        let msg = {
            interactiveMessage: proto.Message.InteractiveMessage.create({
                header: proto.Message.InteractiveMessage.Header.create({
                    hasMediaAttachment: true,
                    ...thumbnail
                }),
                body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: ""
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons
                })
            })
        };

        await conn.relayMessage(m.chat, msg, { messageId: m.key.id });
        replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
    } catch (error) {
        await replyModz(m.chat, `Error: ${error.message || error}`, m);
    }
};

modzbotz.help = ['tourlcatbox <gambar>'];
modzbotz.tags = ['tools'];
modzbotz.command = ['tourlcatbox'];
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;

async function catboxUpload(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, { filename: `file.${ext}`, contentType: mime });

    const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Gagal Menghubungi Catbox');
    return await res.text();
}