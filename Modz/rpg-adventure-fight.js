import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const RPG_DB = path.join(__dirname, "../lib/database/rpg-adventure-fight.json")
const SKILL_DB = path.join(__dirname, "../lib/database/rpg-adventure-skills.json")
if (!fs.existsSync(RPG_DB)) fs.writeFileSync(RPG_DB, '{}')
if (!fs.existsSync(SKILL_DB)) fs.writeFileSync(SKILL_DB, JSON.stringify(generateSkillList(), null, 2))
let db = JSON.parse(fs.readFileSync(RPG_DB))
const skillList = JSON.parse(fs.readFileSync(SKILL_DB))

function save() {
  fs.writeFileSync(RPG_DB, JSON.stringify(db, null, 2))
}

function generateSkillList() {
  const skills = []
  for (let i = 1; i <= 5; i++) skills.push({ name: `Slash Lv${i}`, type: "damage", effect: i * 10 + 10, price: 200 + i * 50 })
  for (let i = 1; i <= 5; i++) skills.push({ name: `Critical Strike Lv${i}`, type: "critical", effect: (1 + i * 0.5).toFixed(1), price: 250 + i * 50 })
  for (let i = 1; i <= 5; i++) skills.push({ name: `Shield Lv${i}`, type: "defense", effect: i * 10 + 20, price: 220 + i * 50 })
  for (let i = 1; i <= 5; i++) skills.push({ name: `Heal Lv${i}`, type: "heal", effect: i * 10 + 20, price: 240 + i * 50 })
  return skills
}

const pendingChallenges = {}
const battleStates = {}

const availableSkills = {
  "Critical Strike": { desc: "Serangan Kritikal. Damage x2", effect: "doubleDamage", price: 200 },
  "Heal": { desc: "Menyembuhkan 30 HP", effect: "heal", price: 200 },
  "Shield": { desc: "Mengurangi 50% Damage Lawan Selama 2 Giliran", effect: "shield", price: 200 }
}

const monsters = [
  { name: 'Goblin', hp: 30, dmg: 5 },
  { name: 'Skeleton', hp: 40, dmg: 8 },
  { name: 'Orc', hp: 50, dmg: 10 },
  { name: 'Wolf', hp: 60, dmg: 12 },
  { name: 'Zombie', hp: 70, dmg: 14 },
  { name: 'Golem', hp: 80, dmg: 16 },
  { name: 'Troll', hp: 90, dmg: 18 },
  { name: 'Vampire', hp: 100, dmg: 20 },
  { name: 'Dragonling', hp: 120, dmg: 25 },
  { name: 'Shadow Beast', hp: 150, dmg: 30 }
]

const modzbotz = async (m, { modz, args, command, text }) => {
  const sender = m.sender

  if (!db[sender]) {
    db[sender] = { hp: 100, exp: 0, gold: 100, level: 1, wins: 0, skills: ['Critical Strike', 'Heal', 'Shield'] }
    save()
  }

  if (command === "pvp") {
    const opponent = m.mentionedJid[0]
    if (!opponent) return await replyModz(`*Tag Lawanmu!*\n\n*Contoh :*.pvp @Target`)

    const opponentId = opponent.endsWith("@s.whatsapp.net") ? opponent : opponent + "@s.whatsapp.net"

    if (!db[opponentId]) {
      db[opponentId] = { hp: 100, exp: 0, gold: 100, level: 1, wins: 0, skills: ['Critical Strike', 'Heal', 'Shield'] }
      save()
    }

    if (pendingChallenges[opponentId]) return await replyModz("Target Sedang Menerima Tantangan Lain!")

    pendingChallenges[opponentId] = {
      challenger: sender,
      timestamp: Date.now()
    }

    await await replyModz(`${opponent.replace(/@.+/, "")} Ditantang Bertarung Oleh ${sender.replace(/@.+/, "")}!

Balas Dengan .terima Untuk Menerima Atau .tolak Untuk Menolak`)
  }

  if (command === "terima" || command === "tolak") {
    const challenge = pendingChallenges[sender]
    if (!challenge) return await replyModz("Tidak Ada Tantangan Yang Menunggumu")

    delete pendingChallenges[sender]

    if (command === "tolak") return await replyModz(`${sender.replace(/@.+/, "")} Menolak Tantangan`)

    const player1 = db[challenge.challenger]
    const player2 = db[sender]

    battleStates[sender] = {
      player1: challenge.challenger,
      player2: sender,
      hp1: player1.hp,
      hp2: player2.hp,
      turn: challenge.challenger,
      shield1: 0,
      shield2: 0
    }

    await await replyModz(`*『 Pertarungan Dimulai! 』*

*⌬ Giliran :* ${challenge.challenger.replace(/@.+/, "")} (Gunakan .skills <Nama> Atau .attack)`)

    save()
  }

  if (command === "attack") {
    const battle = Object.values(battleStates).find(b => b.player1 === sender || b.player2 === sender)
    if (!battle) return await replyModz("Kamu Tidak Sedang Dalam Pertarungan")
    if (battle.turn !== sender) return await replyModz("Bukan Giliranmu.")

    const { player1, player2 } = battle
    const opponent = sender === player1 ? player2 : player1

    let dmg = Math.floor(Math.random() * 20) + 10

    if (sender === player1 && battle.shield2 > 0) dmg = Math.floor(dmg / 2)
    if (sender === player2 && battle.shield1 > 0) dmg = Math.floor(dmg / 2)

    if (sender === player1) battle.hp2 -= dmg
    else battle.hp1 -= dmg

    battle.shield1 = Math.max(0, battle.shield1 - 1)
    battle.shield2 = Math.max(0, battle.shield2 - 1)

    const finished = battle.hp1 <= 0 || battle.hp2 <= 0

    if (finished) {
      const winner = battle.hp1 > 0 ? player1 : player2
      db[winner].gold += 100
      db[winner].exp += 50
      db[winner].wins = (db[winner].wins || 0) + 1

      delete battleStates[sender]

      return await replyModz(`*『 Pertarungan Selesai! 』*

*⌬ Pemenang :* ${winner.replace(/@.+/, "")} (+100 Gold, +50 EXP)`)
    } else {
      battle.turn = opponent
      return await replyModz(`*『 ${dmg} Damage! 』*

*⌬ HP Lawan Tersisa :* ${sender === player1 ? battle.hp2 : battle.hp1}

*⌬ Giliran :* ${opponent.replace(/@.+/, "")}`)
    }
  }

  if (command === "skills") {
    const skillName = text.trim()
  if (!skillName) {
    const skillOwned = db[sender].skills.join(', ') || "Tidak Punya Skills"
    return await replyModz(`*『 Skills Yang Kamu Miliki 』*\n\n*⌬ ${skillOwned}*`)
  }

    const battle = Object.values(battleStates).find(b => b.player1 === sender || b.player2 === sender)
  if (!battle) return await replyModz("Kamu Tidak Sedang Dalam Pertarungan")
  if (battle.turn !== sender) return await replyModz("Bukan Giliranmu")

    const playerSkills = db[sender].skills || []
  if (!playerSkills.includes(skillName)) return await replyModz("Kamu Tidak Punya Skills Ini")

    const skill = availableSkills[skillName]
  if (!skill) return await replyModz("Skills Tidak Ditemukan")

  let info = ''
  if (skill.effect === "doubleDamage") {
    let dmg = (Math.floor(Math.random() * 20) + 10) * 2
    if (sender === battle.player1 && battle.shield2 > 0) dmg = Math.floor(dmg / 2)
    if (sender === battle.player2 && battle.shield1 > 0) dmg = Math.floor(dmg / 2)
    if (sender === battle.player1) battle.hp2 -= dmg
    else battle.hp1 -= dmg
    info = `Serangan Kritikal! ${dmg} Damage`
  }
  if (skill.effect === "heal") {
    if (sender === battle.player1) battle.hp1 += 30
    else battle.hp2 += 30
    info = `Memulihkan 30 HP`
  }
  if (skill.effect === "shield") {
    if (sender === battle.player1) battle.shield1 = 2
    else battle.shield2 = 2
    info = `Shield Aktif Untuk 2 Giliran`
  }

  const finished = battle.hp1 <= 0 || battle.hp2 <= 0

  if (finished) {
    const winner = battle.hp1 > 0 ? battle.player1 : battle.player2
    db[winner].gold += 100
    db[winner].exp += 50
    db[winner].wins = (db[winner].wins || 0) + 1

    delete battleStates[sender]

    return await replyModz(`*『 Pertarungan Selesai! 』*\n\n*⌬ Pemenang :* ${winner.replace(/@.+/, "")} (+100 Gold, +50 EXP)`)
  } else {
    const opponent = sender === battle.player1 ? battle.player2 : battle.player1
    battle.turn = opponent
    return await replyModz(`${info}\n\n*⌬ Giliran :* ${opponent.replace(/@.+/, "")}`)
  }
}

  if (command === "beliskills") {
    if (!text.trim()) {
      const list = skillList.map(s => `- ${s.name} (${s.type}) → ${s.type === "critical" ? `x${s.effect} DMG` : s.type === "heal" ? `+${s.effect} HP` : `${s.effect}${s.type === "defense" ? "% DEF" : " DMG"}`} → ${s.price} gold`).join('\n')
      return await replyModz(`*『 Daftar Skill Tersedia 』*\n\n${list}`)
    }

    const skill = skillList.find(s => s.name.toLowerCase() === text.trim().toLowerCase())
    if (!skill) return await replyModz("Skill Tidak Ditemukan")

    if (db[sender].gold < skill.price) return await replyModz("Goldmu Tidak Cukup")

    if (!db[sender].skills.includes(skill.name)) db[sender].skills.push(skill.name)
    db[sender].gold -= skill.price
    save()

    return await replyModz(`Berhasil Membeli Skills *${skill.name}*`)
  }

  if (command === "monsterfight") {
    const monster = monsters[Math.floor(Math.random() * monsters.length)]
    const result = fightMonster(sender, db[sender], monster)
    save()
    return await replyModz(`*Pertarungan Melawan ${monster.name}*\n${result}`)
  }

  if (command === "rankpvp") {
    const rank = Object.entries(db)
      .sort((a, b) => b[1].wins - a[1].wins)
      .slice(0, 10)
      .map(([id, data], i) => `${i + 1}. ${id.split('@')[0]} | ${data.wins} Menang`)
      .join('\n')
    return await replyModz(`*Ranking Kemenangan PVP*\n\n${rank}`)
  }
}

function fightMonster(id, player, monster) {
  let mHP = monster.hp
  let pHP = player.hp
  let log = ''

  while (mHP > 0 && pHP > 0) {
    const dmgP = Math.floor(Math.random() * 20) + 10
    mHP -= dmgP
    log += `${dmgP} Damage Ke ${monster.name} (${mHP <= 0 ? 'KO!' : mHP} HP)\n`
    if (mHP <= 0) break

    if (Math.random() < 0.2) {
      log += `Kamu Berhasil Menghindari Serangan ${monster.name}\n`
    } else {
      pHP -= monster.dmg
      log += `${monster.dmg} Damage Diterima (${pHP <= 0 ? 'KO!' : pHP} HP)\n`
    }
  }

  if (pHP <= 0) {
    db[id] = undefined // Reset data jika kalah
    return `${log}\nKamu kalah. Data RPG Di-Reset!`
  } else {
    player.hp = pHP
    player.exp += 80
    player.gold += 200
    return `${log}\nKamu Menang Melawan ${monster.name}! (+200 Gold +80 EXP)`
  }
}

modzbotz.help = ["pvp <@tag>", "terima", "tolak", "attack", "skills <nama>", "beliskills <nama>", "monsterfight", "rankpvp"]
modzbotz.tags = ["rpg"]
modzbotz.command = ["pvp", "terima", "tolak", "attack", "skills", "beliskills", "monsterfight", "rankpvp"]
modzbotz.unreg = true

export default modzbotz
