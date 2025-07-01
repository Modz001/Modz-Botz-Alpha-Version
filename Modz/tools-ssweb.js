let modzbotz = async (m, { modz, text, command, isPrem }) => {
    if (!isPrem) {
    if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
        global.limits -= 5
    }
    if (!text) return await replyModz(`*Masukkan URL Website-Nya!*\n\n*Contoh :*\n.${command} https://example.com`)
    
    try {
        await modz.sendMessage(m.chat, {
            image: {
                url: `https://apii.baguss.web.id/tools/ssweb?apikey=bagus&url=${encodeURIComponent(text)}&type=desktop`
            },
            caption: 'Berikut Adalah Screenshot Dari Website Tersebut'
        }, { quoted: m })
        replyModz(`Limit -5\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
    } catch (e) {
        console.error(e)
        await replyModz('Gagal Mengambil Screenshot Website')
    }
}

modzbotz.help = ['ssweb <url>']
modzbotz.tags = ['tools']
modzbotz.command = /^ssweb$/i
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz