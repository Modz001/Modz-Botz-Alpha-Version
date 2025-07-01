let modzbotz = async (m, { modz, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 3;
  }
  await modz.sendMessage(m.chat, {
    image: { url: 'https://pic.re/image' }
  }, { quoted: m });
  replyModz(`Limit -1\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
};

modzbotz.help = ['random-anime'];
modzbotz.command = ['random-anime'];
modzbotz.tags = ['internet'];
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;