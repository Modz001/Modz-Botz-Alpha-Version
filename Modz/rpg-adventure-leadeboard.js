import fs from 'fs'

const dbFile = './lib/database/rpg-adventure.json'
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}')
let db = JSON.parse(fs.readFileSync(dbFile))

function createUser(id) {
  db[id] = {
    hp: 100, exp: 0, gold: 100, level: 1,
    weapon: null, inventory: [], skills: []
  }
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2))
}

let modzbotz = async (m) => {
  // Pastikan semua user ada 'level' dan 'exp'
  for (let id in db) {
    if (!db[id].level || !db[id].exp) createUser(id)
  }

  let leaderboard = Object.entries(db)
    .filter(([_, v]) => v.level && v.exp) // filter yang valid
    .sort((a, b) => b[1].level - a[1].level || b[1].exp - a[1].exp)
    .slice(0, 10)
    .map(([id, data], i) => `${i + 1}. ${id.split('@')[0]} | Lv.${data.level} | EXP ${data.exp}`)
    .join('\n')

  if (!leaderboard) return await replyModz('Tidak Ada Data Pemain Di Leaderboard')

  return await replyModz(`*Leaderboard RPG*\n\n${leaderboard}`)
}

modzbotz.command = ['leaderboard']
modzbotz.help = ['leaderboard']
modzbotz.tags = ['rpg adventure']
modzbotz.unreg = true

export default modzbotz