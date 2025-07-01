import { addSewa, findSewaAktif } from '../lib/database/db.js'

const parseDuration = (text) => {
    const time = text.match(/(\d+)([dhm])/);
    if (!time) return null;

    const amount = parseInt(time[1]);
    const unit = time[2];
    const now = new Date();

    switch (unit) {
        case 'd':
            now.setDate(now.getDate() + amount);
            break;
        case 'h':
            now.setHours(now.getHours() + amount);
            break;
        case 'm':
            now.setMonth(now.getMonth() + amount);
            break;
        default:
            return null;
    }
    return now;
};

let modzbotz = async (m, { modz, args, text }) => {
    if (!text) return await replyModz(`*Contoh :*\n.sewa 30d\n\n*Durasi :*  d (Hari), h (Jam), m (Bulan)`)

    const groupInfo = await modz.groupMetadata(m.chat)
    const id_grup = m.chat
    const nama_grup = groupInfo.subject

    const sewaAktif = await findSewaAktif(id_grup)
    if (sewaAktif) {
        const habis = new Date(sewaAktif.waktu_berakhir).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        return await replyModz(`Grup Ini Sudah Dalam Masa Sewa Dan Akan Berakhir Pada :\n*${habis}*`)
    }
    
    const waktu_berakhir = parseDuration(text.toLowerCase());
    if (!waktu_berakhir) {
        return await replyModz(`Format Durasi Tidak Valid!\nGunakan 'd' Untuk Hari, 'h' Untuk Jam, Atau 'm' Untuk Bulan\n\n*Contoh :*\n.sewa 7d`);
    }

    const waktu_mulai = new Date()
    const id_sewa = 'sewa-' + Date.now()
    const id_penyewa = m.sender

    const sewaData = {
        id_sewa,
        id_grup,
        nama_grup,
        id_penyewa,
        waktu_mulai: waktu_mulai.toISOString(),
        waktu_berakhir: waktu_berakhir.toISOString(),
        status: 'aktif'
    }

    await addSewa(sewaData)

    const tglMulai = waktu_mulai.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'full', timeStyle: 'short' })
    const tglHabis = waktu_berakhir.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'full', timeStyle: 'short' })

    await replyModz(
`*『 Sewa Grup Berhasil 』*

*⌬ Nama Grup :* ${nama_grup}
*⌬ Penyewa :* @${id_penyewa.split('@')[0]}
*⌬ Mulai Sewa :* ${tglMulai}
*⌬ Sewa Berakhir :* ${tglHabis}

Terima Kasih Telah Menyewa! Modz Botz Akan Aktif Di Grup Ini Selama Periode Sewa`
    , { withTag: true })
}

modzbotz.help = ['sewa <durasi>']
modzbotz.tags = ['group']
modzbotz.command = ['sewa', 'rent']
modzbotz.group = true
modzbotz.owner = true

export default modzbotz
