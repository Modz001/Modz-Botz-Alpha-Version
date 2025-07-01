let modzbotz = async (m, { modz, isAdmin, isBotAdmin, participants, groupMetadata }) => {
    if (!m.isGroup) return await replyModz("Fitur Ini Hanya Bisa Digunakan Di Grup")
    if (!isAdmin) return await replyModz("Kamu Harus Menjadi Admin Untuk Menggunakan Perintah Ini")
    if (!isBotAdmin) return await replyModz("Bot Harus Menjadi Admin Untuk Melakukan Kick Semua Member")

    await await replyModz("Mengeluarkan Semua Member...")

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    for (const participant of participants) {
        if (participant.id === m.sender || participant.id === modz.user.id) continue
        
        await modz.groupParticipantsUpdate(m.chat, [participant.id], "remove")
        await delay(2000)
    }

    await await replyModz("Semua Member Telah Dikeluarkan!")
}

modzbotz.help = ['kickall']
modzbotz.tags = ['grup']
modzbotz.command = ['kickall']
modzbotz.unreg = true
modzbotz.group = true
modzbotz.admin = true
modzbotz.botAdmin = true
modzbotz.ownermore = true

export default modzbotz