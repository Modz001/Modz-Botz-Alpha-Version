import fs from 'fs'

const dbPath = './lib/database/promotionch.json'
let channelList = []
if (fs.existsSync(dbPath)) {
    try {
        channelList = JSON.parse(fs.readFileSync(dbPath))
    } catch {
        channelList = []
    }
}

let modzbotz = async (m, { args, command }) => {
    if (!args[0]) {
        return await replyModz(`*Gunakan :*\n\n.${command} add Id Channel\n.${command} remove Id Channel\n.${command} list`)
    }

    const action = args[0].toLowerCase()

    if (action === 'add') {
        const id = args[1]
        if (!id || !/@newsletter$/.test(id)) return await replyModz('Masukkan ID Channel Yang Valid')
        if (channelList.includes(id)) return await replyModz('ID Tersebut Sudah Ada Di Database')
        channelList.push(id)
        fs.writeFileSync(dbPath, JSON.stringify(channelList))
        await replyModz(`Berhasil Menambahkan ID Channel :\n${id}`)
    }

    else if (action === 'remove') {
        const id = args[1]
        if (!id) return await replyModz('Masukkan ID Channel Yang Ingin Dihapus')
        if (!channelList.includes(id)) return await replyModz('ID Tersebut Tidak Ada Di Database')
        channelList = channelList.filter(x => x !== id)
        fs.writeFileSync(dbPath, JSON.stringify(channelList))
        await replyModz(`Berhasil Menghapus ID Channel :\n${id}`)
    }

    else if (action === 'list') {
        const listText = channelList.length
            ? `*Daftar ID Channel :*\n${channelList.map(v => `- ${v}`).join('\n')}`
            : 'Tidak Ada ID Channel Dalam Database'
        await replyModz(listText)
    }

    else {
        await replyModz(`Format Salah!\n\n*Gunakan :*\n\n.${command} add Id Channel\n.${command} remove Id Channel\n.${command} list`)
    }
}

modzbotz.help = ['idpromotionch add <id>', 'idpromotionch remove <id>', 'idpromotionch list']
modzbotz.tags = ['owner']
modzbotz.command = /^idpromotionch$/i
modzbotz.ownermore = true

export default modzbotz