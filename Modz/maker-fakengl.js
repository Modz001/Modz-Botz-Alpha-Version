import axios from 'axios';

let modzbotz = async (m, { modz, text, usedPrefix, command }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 5;
  }
  if (!text || !text.includes('|')) {
    return await replyModz(`Masukkan Judul Dan Isi Pesan Dipisahkan Dengan "|"\n\n*Contoh :*\n${usedPrefix + command} Pesan Dari Surga|Berbuat Baiklah Sebelum Terlambat`);
  }

  const [title, message] = text.split('|').map(v => v.trim());
  if (!title || !message) return await replyModz('Judul Dan Isi Pesan Tidak Boleh Kosong!');

  try {
    const apiUrl = `https://flowfalcon.dpdns.org/imagecreator/ngl?title=${encodeURIComponent(title)}&text=${encodeURIComponent(message)}`;

await modz.sendMessage(m.chat, {
  image: { url: apiUrl },
  caption: null,
  contextInfo: {
    forwardingScore: 999,
    isForwarded: false,
    externalAdReply: {
      title: "Modz Botz",
      body: "Dibuat Oleh Z Dev",
      thumbnailUrl: apiUrl,
      mediaType: 1,
      showAdAttribution: true,
      sourceUrl: "https://cloudkutube.eu"
    }
  }
}, {
  quoted: m
});
    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
  } catch (e) {
    console.error(e);
    await replyModz("Gagal membuat gambar NGL.");
  }
};

modzbotz.help = ['fakengl <judul>|<pesan>'];
modzbotz.tags = ['maker'];
modzbotz.command = /^fakengl$/i;
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;