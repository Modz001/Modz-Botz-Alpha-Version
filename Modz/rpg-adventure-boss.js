import fs from 'fs'
import cron from 'node-cron'

const dbFile = './lib/database/rpg-adventure.json'
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}')
let db = JSON.parse(fs.readFileSync(dbFile))

function save() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2))
}

const dailyBosses = {
  0: { name: 'Elder Dragon', hp: 800, reward: 1000 }, // Minggu
  1: { name: 'Goblin King', hp: 300, reward: 300 },   // Senin
  2: { name: 'Skeleton Lord', hp: 350, reward: 400 }, // Selasa
  3: { name: 'Orc Warlord', hp: 400, reward: 500 },   // Rabu
  4: { name: 'Vampire Count', hp: 450, reward: 600 }, // Kamis
  5: { name: 'Dragon Knight', hp: 500, reward: 700 }, // Jumat
  6: { name: 'Hydra', hp: 600, reward: 800 }          // Sabtu
}

let currentBoss = null

// Spawn otomatis setiap hari jam 12:00
cron.schedule('0 12 * * *', () => {
  const day = new Date().getDay() // 0-6
  currentBoss = { ...dailyBosses[day] }
  console.log(`Boss Harian Muncul : ${currentBoss.name}`)
})

cron.schedule('0 12 * * *', async () => {
  const day = new Date().getDay()
  const currentBoss = { ...dailyBosses[day] }

  try {
    const groups = await modz.groupFetchAllParticipating()
    const groupIds = Object.keys(groups)

    for (const id of groupIds) {
      await modz.sendMessage(id, { text: `『 Boss Harian Muncul 』\n\n*⌬ ${currentBoss.name}*` })
    }
  } catch (err) {
    console.error(err)
  }
})

let modzbotz = async (m, { command }) => {
  let user = db[m.sender]
  if (!user) {
    db[m.sender] = {
      hp: 100, exp: 0, gold: 100, level: 1,
      weapon: null, inventory: [], skills: []
    }
    save()
    user = db[m.sender]
  }

  if (!currentBoss) return await replyModz('Tidak ada Boss Sekarang.\nMuncul Jam 12:00 Setiap Hari')

  currentBoss.hp -= 30
  if (currentBoss.hp <= 0) {
    user.gold += currentBoss.reward
    await replyModz(`Kamu mengalahkan *${currentBoss.name}* Dan Mendapat ${currentBoss.reward} Gold!`)
    currentBoss = null
    save()
    return
  }

  save()
  return await replyModz(`Menyerang Boss *${currentBoss.name}* ➩ HP Boss : ${currentBoss.hp}`)
}

modzbotz.command = ['boss']
modzbotz.help = ['boss']
modzbotz.tags = ['rpg adventure']
modzbotz.unreg = true

export default modzbotz