import fs from 'fs'

const resDB = JSON.parse(fs.readFileSync('./lib/database/reseller.json'))

function saveRes() {
  fs.writeFileSync('./lib/database/reseller.json', JSON.stringify(resDB, null, 2))
}

let modzbotz = async (m, { args, command }) => {
  if (!args[0]) return await replyModz(`*Contoh :*\n.${command} 628xxx`)
  let nomor = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  if (command == 'addreseller') {
    if (resDB.includes(nomor)) return await replyModz('Sudah Reseller')
    resDB.push(nomor)
    saveRes()
    await replyModz('Berhasil Menambahkan Reseller')
  } else {
    if (!resDB.includes(nomor)) return await replyModz('Bukan Reseller')
    resDB.splice(resDB.indexOf(nomor), 1)
    saveRes()
    await replyModz('Berhasil Menghapus Reseller')
  }
}

modzbotz.help = ['addreseller', 'delreseller']
modzbotz.tags = ['owner']
modzbotz.command = ['addreseller', 'delreseller']
modzbotz.ownermore = true

export default modzbotz