import fs from 'fs'

const dbFile = './lib/database/rpg-adventure.json'
let db = JSON.parse(fs.readFileSync(dbFile))

function save() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2))
}

function createUser(id) {
  db[id] = {
    hp: 100,
    exp: 0,
    gold: 100,
    level: 1,
    wins: 0,
    weapon: null,
    inventory: [],
    skills: ['Critical Strike', 'Heal', 'Shield']
  }
  save()
}

let modzbotz = async (m, { command }) => {
  let user = db[m.sender]
  if (!user) {
    createUser(m.sender)
    user = db[m.sender]
  }
  if (!user) return await replyModz('Kamu Belum Punya Profil RPG. Ketik .profile Dulu')

  let today = new Date().toLocaleDateString()
  user.dailyQuest = user.dailyQuest || {}

  if (user.dailyQuest.date == today) return await replyModz('Kamu Sudah Menyelesaikan Quest Hari Ini')

  user.gold += 200
  user.exp += 100
  user.dailyQuest = { date: today }
  save()
  await replyModz(`*Quest Harian Selesai!*\n+200 Gold\n+100 EXP`)
}

modzbotz.command = ['dailyquest']
modzbotz.help = ['dailyquest']
modzbotz.tags = ['rpg adventure']
modzbotz.unreg = true

export default modzbotz