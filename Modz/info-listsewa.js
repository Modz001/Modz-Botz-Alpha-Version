import { getAllSewaAktif } from '../lib/database/db.js'

let modzbotz = async (m, { modz }) => {
    const daftarSewa = await getAllSewaAktif()

    if (daftarSewa.length === 0) {
        return await replyModz('Saat Ini Tidak Ada Grup Yang Sedang Dalam Masa Sewa Aktif')
    }

    let listText = '*『 Daftar Grup Sewa Aktif 』*\n\n'
    for (const sewa of daftarSewa) {
        const habis = new Date(sewa.waktu_berakhir).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        listText += `*⌬ Grup :* ${sewa.nama_grup}\n`
        listText += `*⌬ ID Grup :* ${sewa.id_grup}\n`
        listText += `*⌬ Penyewa :* @${sewa.id_penyewa.split('@')[0]}\n`
        listText += `*⌬ Berakhir :* ${habis}\n\n`
    }

    await replyModz(listText, { withTag: true })
}

modzbotz.help = ['listsewa']
modzbotz.tags = ['info']
modzbotz.command = ['listsewa', 'sewalist', 'rentlist']

export default modzbotz
