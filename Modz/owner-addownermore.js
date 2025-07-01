import fs from 'fs'

const ownermoreDB = JSON.parse(fs.readFileSync('./lib/database/ownermore.json'))

function saveOwnerMore() {
  fs.writeFileSync('./lib/database/ownermore.json', JSON.stringify(ownermoreDB, null, 2))
}

let modzbotz = async (m, { args, command }) => {
  if (!args[0]) return await replyModz(`*Contoh :*\n.${command} 628xxx`)

  let nomor = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  if (command == 'addownermore') {
    if (ownermoreDB.includes(nomor)) return await replyModz('Sudah Menjadi Owner Tambahan.')
    ownermoreDB.push(nomor)
    saveOwnerMore()
    await replyModz(`Berhasil Menambahkan ${nomor} Sebagai *Owner Tambahan*`)
  } else {
    if (!ownermoreDB.includes(nomor)) return await replyModz('Nomor Tersebut Belum Menjadi Owner Tambahan')
    ownermoreDB.splice(ownermoreDB.indexOf(nomor), 1)
    saveOwnerMore()
    await replyModz(`Berhasil Menghapus ${nomor} Dari *Owner Tambahan*`)
  }
}

modzbotz.help = ['addownermore', 'delownermore']
modzbotz.tags = ['owner']
modzbotz.command = ['addownermore', 'delownermore']
modzbotz.owner = true

export default modzbotz