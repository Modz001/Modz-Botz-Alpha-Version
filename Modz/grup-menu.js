let modzbotz = async (m, { modz, args, command, participants }) => {
    if (!m.isGroup) return await replyModz('Fitur Ini Hanya Bisa Digunakan Di Dalam Grup')
    const groupMetadata = await modz.groupMetadata(m.chat)
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)
    const isBotAdmin = groupMetadata.participants.find(p => p.id === modz.user.jid)?.admin
    const isAdmin = admins.includes(m.sender)

    if (!isAdmin) return await replyModz('Fitur Ini Hanya Untuk Admin')
    if (!isBotAdmin) return await replyModz('Bot Harus Menjadi Admin Terlebih Dahulu')

    switch (command) {
        case 'tutupgrup':
            await modz.groupSettingUpdate(m.chat, 'announcement')
            await replyModz('Modz Botz Berhasil Menutup Grup!')
            break

        case 'bukagrup':
            await modz.groupSettingUpdate(m.chat, 'not_announcement')
            await replyModz('Modz Botz Berhasil Membuka Grup!')
            break

        case 'kick':
            if (!args[0]) return await replyModz('Tag Atau Berikan Nomor Member Yang Ingin Di Kick')
            const kickUser = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            await modz.groupParticipantsUpdate(m.chat, [kickUser], 'remove')
            await replyModz('Berhasil Mengeluarkan Member')
            break

        case 'add':
            if (!args[0]) return await replyModz('Berikan Nomor Yang Ingin Ditambahkan')
            const addUser = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            await modz.groupParticipantsUpdate(m.chat, [addUser], 'add')
            await replyModz('Berhasil Menambahkan Member')
            break

        case 'hidetag':
            modz.sendMessage(m.chat, { text: args.join(' '), mentions: participants.map(p => p.id) })
            break

        case 'tagall':
            const teks = args.join(' ') || ''
            const tagList = participants.map(p => `- @${p.id.split('@')[0]}`).join('\n')
            modz.sendMessage(m.chat, {
                text: teks + '\n\n' + tagList,
                mentions: participants.map(p => p.id)
            })
            break

        case 'promote':
            if (!args[0]) return await replyModz('Tag Atau Berikan Nomor Member Yang Ingin Dijadikan Admin')
            const promoteUser = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            await modz.groupParticipantsUpdate(m.chat, [promoteUser], 'promote')
            await replyModz('Berhasil Dijadikan Admin Grup!')
            break

        case 'demote':
            if (!args[0]) return await replyModz('Tag Atau Berikan Nomor Member Yang Ingin Diberhentikan Menjadi Admin')
            const demoteUser = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            await modz.groupParticipantsUpdate(m.chat, [demoteUser], 'demote')
            await replyModz('Berhasil Memberhentikan Menjadi Admin')
            break
    }
}

modzbotz.help = ['tutupgrup', 'bukagrup', 'kick', 'add', 'hidetag', 'tagall', 'promote', 'demote']
modzbotz.tags = ['grup']
modzbotz.command = ['tutupgrup', 'bukagrup', 'kick', 'add', 'hidetag', 'tagall', 'promote', 'demote']
modzbotz.unreg = true

export default modzbotz