import axios from 'axios';
import FormData from 'form-data';
 
async function Uguu(buffer, filename) {
  const form = new FormData();
  form.append('files[]', buffer, { filename });
 
  const { data } = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders(),
  });
 
  if (data.files && data.files[0]) {
    return data.files[0].url;
  } else {
    throw new Error('Upload Gagal');
  }
}
 
let modzbotz = async (m, { modz, text, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 5;
  }
  if (!text.includes('|')) return await replyModz(`Kirim Gambar +\n\nNama|Username|Verified(true/false)|Followers|Following|Likes|Bio|Dark(true/false)|Follow(true/false)\n\n*Contoh :*\n.faketiktok Modz|modzazp|true|150000|500|200000|Modz Never Die|true|false`);
 
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime || !mime.startsWith('image/')) return await replyModz(`Silakan Kirim Atau Reply *Gambar* Untuk Foto Profil`);
 
  let buffer = await q.download();
  let ext = mime.split('/')[1];
  let filename = `pp.${ext}`;
  let pp = await Uguu(buffer, filename);
 
  let [name, username, verified, followers, following, likes, bio, dark = 'true', isFollow = 'true'] = text.split('|').map(v => v.trim());
 
  if (!name || !username || !followers || !following || !likes || !bio)
    return await replyModz('Semua Harus Ada Ya');
 
  await modz.sendMessage(m.chat, {
    image: {
      url: `https://FlowFalcon.dpdns.org/imagecreator/faketiktok?name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&pp=${encodeURIComponent(pp)}&verified=${verified}&followers=${followers}&following=${following}&likes=${likes}&bio=${encodeURIComponent(bio)}&dark=${dark}&isFollow=${isFollow}`
    }
  }, { quoted: m });
  replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
};
 
modzbotz.help = ['faketiktok <data>|<gambar>'];
modzbotz.tags = ['maker'];
modzbotz.command = ['faketiktok'];
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;