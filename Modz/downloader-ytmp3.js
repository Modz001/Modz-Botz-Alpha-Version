import fetch from 'node-fetch';

let modzbotz = async (m, { modz, command, text, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 10;
  }
  if (!text) return await replyModz(`Masukkan Link-Nya\n\n*Contoh :*\n.${command} <Link>`);
  try {
    let api = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(text)}`;
    let response = await fetch(api);
    let data = await response.json();
    
    if (!data.result || !data.result.download.url) throw 'Gagal Mendapatkan Audio. Coba Lagi!';

    let { metadata, download } = data.result;
    let { title, duration, views, author, thumbnail } = metadata;
    let audioUrl = download.url;
 await modz.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title,
          body: `Durasi : ${duration.timestamp} | Views : ${views.toLocaleString()}`,
          thumbnailUrl: thumbnail,
          renderLargerThumbnail: true,
          mediaType: 1,
          mediaUrl: text,
          sourceUrl: text
        }
      }
    }, { quoted: m });

    replyModz(`Limit -10\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
  } catch (error) {
    console.error(error);
    return await replyModz('Gagal, Coba Lagi Nanti!');
  }
};

modzbotz.help = ['ytmp3 <link>'];
modzbotz.tags = ['downloader'];
modzbotz.command = ['ytmp3'];
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz