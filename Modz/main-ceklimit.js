let modzbotz = async (m, { modz, isPrem }) => {
await replyModz(`Kamu Memiliki ${isPrem ? 'Unli' : global.limits} Limit\nLimit Pengguna Biasa Akan Di Reset Setiap 24 Jam\nIngat! Gunakan Fitur Dengan Bijak Agar Limit Kamu Tidak Cepat Habis`)
}

modzbotz.help = ['ceklimit']
modzbotz.tags = ['main']
modzbotz.command = /^ceklimit$/i

export default modzbotz