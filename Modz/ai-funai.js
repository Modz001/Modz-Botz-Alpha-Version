import axios from 'axios';

let modzbotz = async (m, { text, isPrem }) => {
   if (!isPrem) {
   if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
    global.limits -= 3;
  }
  if (!text) return await replyModz('Ya, Ada Yang Bisa Saya Bantu? 😊');

  let { data } = await axios.get(`https://www.abella.icu/openai?q=${encodeURIComponent(text)}`);
  if (data?.status !== 'success') return await replyModz('Gagal Mendapatkan Jawaban.');

  let res = data.data;
  let hasil = `${res.answer.trim()}`;

  await replyModz(hasil);

  replyModz(`Limit -3\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
};

modzbotz.help = ['funai <pertanyaan>'];
modzbotz.command = ['funai'];
modzbotz.tags = ['ai'];
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;