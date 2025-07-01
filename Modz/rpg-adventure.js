import fs from 'fs'
import cron from 'node-cron'

const dbFile = './lib/database/rpg-adventure.json'
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}')
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

const monsters = [
  { name: 'Goblin', hp: 30, dmg: 10, reward: 20 },
  { name: 'Skeleton', hp: 50, dmg: 15, reward: 40 },
  { name: 'Wolf', hp: 60, dmg: 20, reward: 60 },
  { name: 'Dragon', hp: 100, dmg: 30, reward: 130 },
]
const loot = ['Health Potion', 'Iron Sword', 'Magic Scroll', 'Rare Gem']

const shopItems = [
  { name: 'Iron Sword', price: 120, type: 'weapon', dmg: 15 },
  { name: 'Shield', price: 80, type: 'armor', def: 5 },
  { name: 'Health Potion', price: 30, type: 'consumable', heal: 50 },
]

setInterval(() => {
  for (let id in db) {
    if (db[id].hp < 100) db[id].hp = Math.min(db[id].hp + 5, 100)
  }
  save()
}, 1000 * 60 * 60) // Auto regen HP setiap jam

let modzbotz = async (m, { modz, command, args, text }) => {
  let user = db[m.sender]
  if (!user) {
    createUser(m.sender)
    user = db[m.sender]
  }

  switch (command) {
    case 'profile':
      return await replyModz(`
*『 RPG Profile 』*

*⌬ HP : ${user.hp}*
*⌬ EXP : ${user.exp}*
*⌬ Level : ${user.level}*
*⌬ Gold : ${user.gold}*
*⌬ Weapon : ${user.weapon || 'None'}*
*⌬ Inventory : ${user.inventory.join(', ') || 'Empty'}*
`)

    case 'adventure': {
      let monster = monsters[Math.floor(Math.random() * monsters.length)]
      let dmg = monster.dmg
      user.hp -= dmg
      user.exp += monster.reward
      user.gold += Math.floor(monster.reward / 2)

      let lootDrop = ''
      if (Math.random() < 0.3) {
        let drop = loot[Math.floor(Math.random() * loot.length)]
        user.inventory.push(drop)
        lootDrop = `\n*『 Drop 』*\n\n*⌬ ${drop}*`
      }

      if (user.hp <= 0) {
        user.hp = 100
        user.exp = 0
        user.gold = 0
        user.level = 1
        save()
        return await replyModz(`You Fought ${monster.name} And *Died*. Progress Reset`)
      }

      if (user.exp >= 100 * user.level) {
        user.level++
        user.exp = 0
        lootDrop += `\n*Level Up!* Now Level ${user.level}!`
      }
      save()
      return await replyModz(`*『 You Fought ${monster.name}! 』*\n\n*⌬ Damage :* ${dmg}\n*⌬ EXP :* ${monster.reward}\n*⌬ Gold :* ${Math.floor(monster.reward / 2)}${lootDrop}\n*⌬ HP :* ${user.hp}`)
    }

    case 'shop':
      return await replyModz(`*『 Shop 』*\n\n` + shopItems.map((v, i) => `${i + 1}. ${v.name} - ${v.price}`).join('\n'))

    case 'buy':
      if (!args[0]) return await replyModz('*Contoh :*\n.buy <Item Bumber>*\n\nLihat Shop Dengan .shop')
      let item = shopItems[Number(args[0]) - 1]
      if (!item) return await replyModz('Item Tidak Ditemukan')
      if (user.gold < item.price) return await replyModz('Gold Kamu Tidak Cukup')
      user.gold -= item.price
      user.inventory.push(item.name)
      save()
      return await replyModz(`Berhasil Membeli *${item.name}*!`)

    case 'equip':
      if (!args[0]) return await replyModz('*Contoh :*\n.equip <Nama Item>*')
      if (!user.inventory.includes(args[0])) return await replyModz('Kamu Tidak Memiliki Item Ini')
      user.weapon = args[0]
      save()
      return await replyModz(`Kamu Sekarang Memakai *${args[0]}*`)

    case 'inventory':
      return await replyModz(`*『 Inventory 』*\n\n*⌬ ${user.inventory.join(', ') || 'Empty'}*`)

    case 'heal':
      if (user.gold < 20) return await replyModz('Gold Kamu Kurang (Butuh 20)')
      user.gold -= 20
      user.hp = Math.min(user.hp + 50, 100)
      save()
      return await replyModz(`Kamu Telah Disembuhkan +50 HP (Total : ${user.hp})`)
   }
}

modzbotz.help = ['profile', 'adventure', 'shop', 'buy', 'equip', 'inventory', 'heal']
modzbotz.tags = ['rpg adventure']
modzbotz.command = ['profile', 'adventure', 'shop', 'buy', 'equip', 'inventory', 'heal']
modzbotz.unreg = true

export default modzbotz