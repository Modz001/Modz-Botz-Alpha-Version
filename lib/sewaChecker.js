import { getExpiredSewas, updateSewaStatus } from './database/db.js'

export const checkSewaExpiration = async (modz) => {
    try {
        const expiredSewas = await getExpiredSewas()

        if (expiredSewas.length > 0) {
            console.log(`[SEWA CHECKER] Ditemukan ${expiredSewas.length} Sewa Yang Telah Berakhir. Memproses...`)
        }

        for (const sewa of expiredSewas) {
            await updateSewaStatus(sewa.id_sewa, 'habis')

            const message = `Waktu Sewa Untuk Grup *${sewa.nama_grup}* Telah Berakhir. Terima Kasih Telah Menggunakan Layanan Kami`
            await modz.sendMessage(sewa.id_grup, { text: message })

            await modz.groupLeave(sewa.id_grup)

            console.log(`[SEWA CHECKER] Sewa Untuk grup ${sewa.nama_grup} (${sewa.id_grup}) telah diproses.`)
        }
    } catch (error) {
        console.error('[SEWA CHECKER] Terjadi Error :', error)
    }
}
