import axios from 'axios';
import fs from 'fs';

const DB_PATH = './lib/database/chats-modzgpt.json';
let aiChats = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH)) : {};

function saveChat(sender, from, message) {
    if (!aiChats[sender]) aiChats[sender] = [];
    aiChats[sender].push({ from, message, timestamp: Date.now() });
    fs.writeFileSync(DB_PATH, JSON.stringify(aiChats, null, 2));
}

function getPreviousChats(sender, limit = 5) {
    if (!aiChats[sender]) return [];
    return aiChats[sender].slice(-limit);
}

let modzbotz = async (m, { text }) => {
    new Promise(async (resolve) => {
        let q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        let input;
        let mdz;

        const previousChats = getPreviousChats(m.sender);
        const context = previousChats
            .map(chat => `${chat.from === 'user' ? 'User' : 'AI'}: ${chat.message}`)
            .join('\n');

        const systemMessage = `
Kamu adalah ModzGPT, sebuah asisten AI pintar yang dirancang untuk membantu menjawab pertanyaan dengan ramah dan jelas. Kamu diciptakan dan dikembangkan oleh Modz Never Die.

Jika seseorang bertanya "siapa kamu", "kamu siapa", "siapa yang buat kamu", atau pertanyaan sejenis, jawablah dengan:
"Aku adalah ModzGPT, asisten AI buatan Modz Never Die. Aku di sini untuk membantumu!"

Kamu tidak boleh mengaku sebagai ChatGPT, OpenAI, atau produk lain. Kamu hanya dikenal sebagai ModzGPT buatan Modz Never Die.
Jawabanmu harus sopan, informatif, dan mudah dipahami.
        `;

        if (/image/.test(mime)) {
            input = `${context}\nUser: ${text || 'Apakah Kamu Tau Gambar Ini'}\nAI:`;
            mdz = {
                model: 'gpt-4.1-mini',
                imageBuffer: await q.download()
            };
        } else {
            input = `${context}\nUser: ${text || 'Halo'}\nAI:`;
            mdz = {
                model: 'gpt-4.1-mini'
            };
        };

        await pollai(input, { systemMessage, ...mdz }).then(async (response) => {
            saveChat(m.sender, 'user', text || 'Halo');
            saveChat(m.sender, 'ai', response);
            await await replyModz(response);
        }).catch(async (err) => {
            await await replyModz('Maaf Terjadi Kesalahan!')
            console.error(err)
        })
    })
}

// Function Pollinations AI
async function pollai(question, {
    systemMessage = null,
    model = 'gpt-4.1-mini',
    imageBuffer = null
} = {}) {
    try {
        const modelList = {
            'gpt-4.1': 'openai-large',
            'gpt-4.1-mini': 'openai',
            'gpt-4.1-nano': 'openai-fast'
        };

        if (!question) throw new Error('Question is required');
        if (!modelList[model]) throw new Error(`List available model: ${Object.keys(modelList).join(', ')}`);

        const messages = [
            ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
            {
                role: 'user',
                content: [
                    { type: 'text', text: question },
                    ...(imageBuffer ? [{
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
                        }
                    }] : [])
                ]
            }
        ];

        const { data } = await axios.post('https://text.pollinations.ai/openai', {
            messages,
            model: modelList[model],
            temperature: 0.5,
            presence_penalty: 0,
            top_p: 1,
            frequency_penalty: 0
        }, {
            headers: {
                accept: '*/*',
                authorization: 'Bearer dummy',
                'content-type': 'application/json',
                origin: 'https://sur.pollinations.ai',
                referer: 'https://sur.pollinations.ai/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });

        return data.choices[0].message.content;
    } catch (error) {
        console.error(error.message);
        throw new Error('No Result Found');
    }
}

// Metadata command bot
modzbotz.help = ['modzgpt <pertanyaan>'];
modzbotz.tags = ['ai'];
modzbotz.command = ['modzgpt'];
modzbotz.unreg = true;
modzbotz.premium = true;
modzbotz.author = 'Modz Never Die';
modzbotz.desc = 'ModzGPT AI By Modz';

export default modzbotz;