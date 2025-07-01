import fs from 'fs'

const premDB = JSON.parse(fs.readFileSync('./lib/database/premium.json'))

function savePrem() {
  fs.writeFileSync('./lib/database/premium.json', JSON.stringify(premDB, null, 2))
}

let modzbotz = async (m, { args, command }) => {
  if (!args[0]) return await replyModz(`*Contoh:* ${command} 628xxx`)
  let nomor = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  if (command == 'addprem') {
    if (premDB.includes(nomor)) return await replyModz('Sudah Premium')
    premDB.push(nomor)
    savePrem()
    await replyModz('Berhasil Menambahkan Premium')
  } else {
    if (!premDB.includes(nomor)) return await replyModz('Bukan Premium')
    premDB.splice(premDB.indexOf(nomor), 1)
    savePrem()
    await replyModz('Berhasil Menghapus Premium')
  }
}

modzbotz.help = ['addprem', 'delprem']
modzbotz.tags = ['owner']
modzbotz.command = ['addprem', 'delprem']
modzbotz.ownermore = true

export default modzbotz