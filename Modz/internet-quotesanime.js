import axios from 'axios';

let modzbotz = async (m, { isPrem }) => {
  if (!isPrem) {
  if (global.limits < 3) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
      global.limits -= 1;
  }
    return new Promise(async (resolve, reject) => {
        await axios.get('https://cabrata.github.io/quotesnime-database/quotes.json').then(async (a) => {
            const quotes = a.data
            const get = pickRandom(quotes)
            let caption = `*Quotes Anime*
*⌬ Character :* ${get.character || ''}
*⌬ Anime :* ${get.anime || ''}
*⌬ Episode :* ${get.episode || ''}
*⌬ Tags :* ${get.category || ''}

*⌬ Quotes :* ${get.quotes || ''}`;
            replyModz(caption);
            replyModz(`Limit -1\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
        }).catch((err) => {
            replyModz('Maaf Error');
            console.error('msg:' + err);
        })
    });
};

modzbotz.help = ['quotes-anime'];
modzbotz.tags = ['internet'];
modzbotz.command = /^quotes-anime$/i;
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;

function pickRandom(list) {
   return list[Math.floor(Math.random() * list.length)];
}