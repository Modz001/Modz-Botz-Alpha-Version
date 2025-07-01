import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const db = new Low(new JSONFile('sewa.json'))

const initializeDb = async () => {
  await db.read()
  db.data ||= { sewa_grup: [] }
  await db.write()
}

initializeDb()

export const addSewa = async (sewaData) => {
  await db.read()
  db.data.sewa_grup.push(sewaData)
  await db.write()
}

export const findSewaAktif = async (id_grup) => {
  await db.read()
  return db.data.sewa_grup.find(s => s.id_grup === id_grup && s.status === 'aktif') || null
}

export const updateSewaStatus = async (id_sewa, status) => {
  await db.read()
  const sewa = db.data.sewa_grup.find(s => s.id_sewa === id_sewa)
  if (sewa) {
    sewa.status = status
    await db.write()
  }
}

export const getAllSewaAktif = async () => {
  await db.read()
  return db.data.sewa_grup.filter(s => s.status === 'aktif')
}

export const getExpiredSewas = async () => {
  await db.read();
  const now = new Date();
  return db.data.sewa_grup.filter(s => s.status === 'aktif' && new Date(s.waktu_berakhir) < now);
}
