let modzbotz = async (m, { args }) => {
  if (!args[0]) return await replyModz(`*Contoh :*\n.deluser 628xxx`)

  let nomor = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  if (!global.db.data.users[nomor]) return await replyModz('User Tidak Ditemukan')

  delete global.db.data.users[nomor]
  await replyModz(`Berhasil Menghapus User ${args[0]}`)
}

modzbotz.help = ['deluser']
modzbotz.tags = ['database']
modzbotz.command = ['deluser']
modzbotz.owner = true

export default modzbotz