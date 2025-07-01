let modzbotz = async (m) => {
  const users = Object.entries(global.db.data.users).filter(([_, data]) => data.registered)

  if (users.length === 0) return await replyModz('Belum Ada User Terdaftar')

  let teks = '*『 List Pengguna Terdaftar 』*\n\n' + users.map(([jid, data], i) =>
    `${i + 1}. ${data.name} ➩ wa.me/${jid.replace(/@.+/, '')}`
  ).join('\n')

  await replyModz(teks)
}

modzbotz.help = ['listuser']
modzbotz.tags = ['database']
modzbotz.command = ['listuser']
modzbotz.ownermore = true

export default modzbotz