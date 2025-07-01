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

let modzbotz = async (m, { command, args }) => {
  let user = db[m.sender]
  if (!user) {
    createUser(m.sender)
    user = db[m.sender]
  }
  if (!user) return await replyModz('Kamu Belum Punya Profil RPG. Ketik .profile Dulu')
  if (!args[0]) return await replyModz('*Contoh :*\n.craft Great Sword')

  let crafted = args.join(' ')
  if (user.gold < 300) return await replyModz('Gold kamu Kurang (Butuh 300)')

  user.gold -= 300
  user.inventory.push(crafted)
  save()
  await replyModz(`*Crafting Selesai!*\nKamu Membuat : *${crafted}*`)
}

modzbotz.command = ['craft']
modzbotz.help = ['craft']
modzbotz.tags = ['rpg adventure']
modzbotz.unreg = true

export default modzbotz