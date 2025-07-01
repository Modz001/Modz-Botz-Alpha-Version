import {
    fetch
} from 'undici';
import jsbe from 'js-beautify';
const html = jsbe.html

const modzbotz = async (m, {
    modz,
    text,
    isPrem
}) => {
    if (!isPrem) {
    if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas');
        global.limits -= 5;
    }
    if (!text.includes('https://')) return await replyModz('*Contoh :*\n.get https://modzweb.vercel.app');
    new Promise(async (revolse) => {
        await fetch(text).then(async (response) => {
            let mime
            try {
               mime =  response.headers.get('content-type').split(';')[0];
            } catch (err) {
               mime = response.headers.get('content-type')
            }

            let body
            if (/html/.test(mime)) {
                body = await response.text();
                const resht = await html(body);
                await modz.sendMessage(m.chat, {
                    document: Buffer.from(resht),
                    mimetype: mime,
                    fileName: 'result.html'
                }, {
                    quoted: m
                });
            } else if (/video/.test(mime)) {
                body = Buffer.from(await response.arrayBuffer());
                await modz.sendMessage(m.chat, {
                    video: body
                }, {
                    quoted: m
                });
            } else if (/image/.test(mime)) {
                body = Buffer.from(await response.arrayBuffer());
                await modz.sendMessage(m.chat, {
                    image: body
                }, {
                    quoted: m
                });
            } else if (/audio/.test(mime)) {
                body = Buffer.from(await response.arrayBuffer());
                await modz.sendMessage(m.chat, {
                    audio: body,
                    mimetype: mime
                }, {
                    quoted: m
                });
            } else {
                body = await response.json();
                await modz.sendMessage(m.chat, {
                    text: JSON.stringify(body)
                }, {
                    quoted: m
                });
            };
            replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`);
        }).catch(async (e) => {
            await await replyModz('Maaf Gagal Di Get Url Nya!');
            await console.log('Error', e);
        });
    });
};

modzbotz.help = ['get <url>'];
modzbotz.tags = ['tools'];
modzbotz.command = /^(get|fetch|fetching)$/i;
modzbotz.unreg = true;
modzbotz.limit = true;

export default modzbotz;