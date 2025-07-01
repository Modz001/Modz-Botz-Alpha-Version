let modzbotz = async (m, { args, text, command }) => {
  const user = global.db.data.users[m.sender]
  if (user.registered) return await replyModz('Kamu Sudah Terdaftar')

  if (!text.includes('|')) return await replyModz(`*Contoh :*\n.registrasi Nama|Umur`)

  let [nama, umur] = text.split('|').map(v => v.trim())
  if (!nama) return await replyModz('Nama Tidak Boleh Kosong')
  umur = parseInt(umur)
  if (isNaN(umur)) return await replyModz('Umur Harus Berupa Angka')

  if (umur > 100) return await replyModz('Sebaiknya Kamu Istirahat Saja')
  if (umur > 60) return await replyModz('Kamu Terlalu Tua Untuk Menggunakan Modz Botz')
  if (umur < 5) return await replyModz('Kamu Masih Terlalu Muda Untuk Menggunakan Modz Botz')

  user.name = nama
  user.age = umur
  user.regTime = new Date() * 1
  user.registered = true

  await replyModz(`*『 Registrasi Berhasil 』*\n\n*⌬ Nama :* ${nama}\n*⌬ Umur :* ${umur} Tahun\n*⌬ ID :* ${m.sender.replace(/@.+/, '')}`)
}

modzbotz.help = ['registrasi']
modzbotz.tags = ['main']
modzbotz.command = ['register', 'registrasi']

export default modzbotz