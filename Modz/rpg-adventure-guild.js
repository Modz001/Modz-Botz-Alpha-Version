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

  if (command == 'createguild') {
    if (user.guild) return await replyModz('Kamu Sudah Punya Guild')
    if (!args[0]) return await replyModz('*Contoh :*\n.createguild <Nama>*')
    user.guild = args[0]
    save()
    return await replyModz(`*Guild Dibuat :* ${args[0]}`)
  }

  if (command == 'myguild') {
    return await replyModz(`*Guild Kamu :* ${user.guild || 'Belum punya'}`)
  }
}

modzbotz.command = ['createguild', 'myguild']
modzbotz.help = ['createguild <nama>', 'myguild']
modzbotz.tags = ['rpg adventure']
modzbotz.unreg = true

export default modzbotz