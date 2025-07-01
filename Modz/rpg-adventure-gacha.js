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

const pool = ['Common Sword', 'Rare Shield', 'Epic Gem', 'Legendary Sword']

let modzbotz = async (m, { command }) => {
  let user = db[m.sender]
  if (!user) {
    createUser(m.sender)
    user = db[m.sender]
  }
  if (!user) return await replyModz('Kamu Belum Punya Profil RPG. Ketik .profile Dulu')
  if (user.gold < 100) return await replyModz('Gold Kamu Kurang (Butuh 100)')

  user.gold -= 100
  let item = pool[Math.floor(Math.random() * pool.length)]
  user.inventory.push(item)
  save()
  await replyModz(`Gacha Result\nKamu Mendapatkan : *${item}*`)
}

modzbotz.command = ['gacha']
modzbotz.help = ['gacha']
modzbotz.tags = ['rpg adventure']
modzbotz.unreg = true

export default modzbotz