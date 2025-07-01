import { findSewaAktif, updateSewaStatus } from '../lib/database/db.js'

let modzbotz = async (m, { modz }) => {
    const id_grup = m.chat
    const sewaAktif = await findSewaAktif(id_grup)

    if (!sewaAktif) {
        return await replyModz('Grup Ini Tidak Sedang Dalam Masa Sewa Aktif')
    }

    await updateSewaStatus(sewaAktif.id_sewa, 'dibatalkan')
    
    await replyModz(`Berhasil Membatalkan Masa Sewa Untuk Grup Ini`)
}

modzbotz.help = ['delsewa']
modzbotz.tags = ['grup']
modzbotz.command = ['delsewa', 'stopsewa', 'delrent']
modzbotz.group = true
modzbotz.owner = true

export default modzbotz
