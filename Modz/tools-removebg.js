import axios from 'axios';
import FormData from 'form-data';

async function Uguu(buffer, filename) {
  try {
    const form = new FormData();
    form.append('files[]', buffer, { filename });
    const { data } = await axios.post('https://uguu.se/upload.php', form, {
      headers: form.getHeaders(),
    });
    if (data.files && data.files[0]) {
      return {
        name: data.files[0].name,
        url: data.files[0].url,
        size: data.files[0].size,
      };
    } else {
      throw new Error('Upload Gagal');
    }
  } catch (err) {
    throw `Terjadi Kesalahan Saat Upload : ${err.message}`;
  }
}

let modzbotz = async (m, { modz, usedPrefix, command }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 5;
  }
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime || !mime.startsWith('image/'))
      return await replyModz(`*Contoh :*\nReply Gambar Dengan Caption ${usedPrefix + command}`);

    let media = await q.download();
    let ext = mime.split('/')[1];
    let filename = `upload.${ext}`;

    let result = await Uguu(media, filename);

    let { data } = await axios.get(`https://www.abella.icu/rmbg?url=${result.url}`, { responseType: 'arraybuffer' });

    await modz.sendMessage(m.chat, { image: data }, { quoted: m });

    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
  } catch (error) {
    await modz.sendMessage(m.chat, { text: `${error}` }, { quoted: m });
  }
};

modzbotz.help = ['removebg <gambar>'];
modzbotz.tags = ['tools'];
modzbotz.command = ['removebg'];
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;