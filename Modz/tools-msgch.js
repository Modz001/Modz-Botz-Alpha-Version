let modzbotz = async (m, { modz, text, quoted, command, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 5;
  }
  const channelJid = '120363379975415016@newsletter';
  const pushname = m.pushName || 'User';
  const qMedia = quoted || m;
  const mtype = quoted ? quoted.mtype : m.mtype;
  const mime = (qMedia.msg || qMedia)?.mimetype || '';
  const hasText = text?.length > 0;
  const isMedia = /image|video|audio/.test(mime);

  if (!hasText && !isMedia) {
    return await replyModz(`*Kirim Teks Atau Reply Ke Media _(Bukan View-Once/Status)_*\n\n*Contoh :*\n*⌬ .${command} Halo*\n*⌬ Reply Media Lalu Ketik .${command}*`);
  }

  try {
    if (isMedia) {
      const buffer = await quoted.download();
      if (!buffer) return await replyModz('Gagal Mengakses Media. Pastikan Kamu Reply Ke Media Biasa, Bukan View-Once Atau Status');

      let message = {
        caption: text || '',
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: 'Modz Botz',
            body: `${mtype.includes("audio") ? "Voice Note" : mtype.includes("video") ? "Video" : "Gambar"} Dari ${pushname}`,
            thumbnailUrl: 'https://files.catbox.moe/8381kq.jpg',
            sourceUrl: ''
          }
        }
      };

      if (/image/.test(mime)) {
        await modz.sendMessage(channelJid, { ...message, image: buffer });
      } else if (/video/.test(mime)) {
        await modz.sendMessage(channelJid, { ...message, video: buffer });
      } else if (/audio/.test(mime)) {
        await modz.sendMessage(channelJid, {
          audio: buffer,
          ptt: true,
          contextInfo: message.contextInfo
        });
      }

    } else {
      await modz.sendMessage(channelJid, {
        text,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: 'Modz Botz',
            body: `Pesan Dari ${pushname}`,
            thumbnailUrl: 'https://files.catbox.moe/8381kq.jpg',
            sourceUrl: ''
          }
        }
      });
    }

    await replyModz('Berhasil Dikirim Ke Channel Modz Botz | AZP');
    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
  } catch (err) {
    console.error('Error Msgch:', err);
    await replyModz('Gagal Mengirim. Pastikan Bot Admin Channel Dan Media Valid');
  }
};

modzbotz.help = ["msgch <text/media>"];
modzbotz.tags = ["tools"];
modzbotz.command = ["msgch"];
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;