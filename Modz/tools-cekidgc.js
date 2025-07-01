let modzbotz = async (m, { modz, text, command, isPrem }) => {
    if (!isPrem) {
    if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
        global.limits -= 2
    }
    if (!text) return await replyModz(`*Masukkan Link Undangan Grup!*\n\n*Contoh :*\n.${command} https://chat.whatsapp.com/xxxxx`)
    
    const _grup = /chat.whatsapp.com\/([\w\d]*)/
    if (!_grup.test(text)) return await replyModz('Masukkan Link Undangan Grup Yang Valid!')

    const code = text.match(_grup)[1] // Ini kode undangan yang dibutuhkan

    try {
        let res = await modz.groupGetInviteInfo(code) // Ambil info grup berdasarkan kode undangan
        let teks = `*『 Group Information 』*\n\n` +
            `*⌬ Name :* ${res.subject}\n` +
            `*⌬ ID :* ${res.id}\n` +
            `*⌬ Created At :* ${new Date(res.creation * 1000).toLocaleString()}\n` +
            `${res.owner ? `*⌬ Owner :* ${res.owner}\n` : ''}` +
            `${res.desc ? `*⌬ Description :* ${res.desc}` : ''}`
        await replyModz(teks)
        replyModz(`Limit -1\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
    } catch (err) {
        console.error(err)
        await replyModz(`Terjadi Error :\n\n${err.message}`)
    }
}

modzbotz.help = ['cekidgc <link>']
modzbotz.tags = ['tools']
modzbotz.command = /^cekidgc$/i
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz