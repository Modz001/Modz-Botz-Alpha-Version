import fetch from 'node-fetch';

let modzbotz = async (m, { modz, args, usedPrefix, command, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 5;
  }
  if (!args[0]) return await replyModz(`Masukkan URL-Nya\n\n*Contoh :*\n${usedPrefix + command} https://www.mediafire.com/file/xxxxxxxx`);

  try {
    const res = await fetch(`https://fastrestapis.fasturl.cloud/downup/mediafiredown?url=${encodeURIComponent(args[0])}`);
    if (!res.ok) throw 'Gagal Mengambil Data';

    const json = await res.json();
    if (json.status !== 200 || !json.result) throw 'Terjadi Kesalahan Saat Mengambil Data MediaFire';

    const { filename, size, created, filetype, download } = json.result;

    let caption = `
*『 Mediafire Downloader 』*
*⌬ Nama File :* ${filename}
*⌬ Ukuran :* ${size}
*⌬ Tipe :* ${filetype}
*⌬ Upload :* ${created}
`.trim();

    await await replyModz(caption);

    await modz.sendMessage(m.chat, {
      document: { url: download },
      fileName: filename.endsWith('.zip') ? filename : `${filename}.zip`,
      mimetype: 'application/zip'
    }, { quoted: m });

    replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
  } catch (e) {
    console.error(e);
    await replyModz(typeof e === 'string' ? e : 'Terjadi Kesalahan Saat Memproses Permintaan');
  }
};

modzbotz.help = ['mediafire <url>'];
modzbotz.tags = ['downloader'];
modzbotz.command = /^mediafire|mf$/i;
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz;