import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import chalk from "chalk"
import moment from "moment-timezone"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database paths
const USER_DB = path.join(__dirname, "../lib/database/rpg-monters-user.json")
const BATTLE_DB = path.join(__dirname, "../lib/database/rpg-monster-battles.json")

// Get current time for logging
const getTime = () => {
  return moment().format("HH:mm:ss")
}

// Store pending battles in memory
const pendingBattles = {} // Untuk menyimpan tantangan sementara

// Get element emoji
const getElementEmoji = (element) => {
  switch (element) {
    case "api":
      return "🔥"
    case "air":
      return "💧"
    case "tanah":
      return "🌍"
    case "listrik":
      return "⚡"
    default:
      return "❓"
  }
}

// Load data pengguna
const loadUserData = () => {
  try {
    if (!fs.existsSync(USER_DB)) fs.writeFileSync(USER_DB, "{}")
    return JSON.parse(fs.readFileSync(USER_DB))
  } catch (error) {
    console.error(chalk.red(`[${getTime()}] Error Loading User Data :`), error)
    return {}
  }
}

// Load data pertarungan
const loadBattleData = () => {
  try {
    if (!fs.existsSync(BATTLE_DB)) fs.writeFileSync(BATTLE_DB, "{}")
    return JSON.parse(fs.readFileSync(BATTLE_DB))
  } catch (error) {
    console.error(chalk.red(`[${getTime()}] Error Loading Battle Data :`), error)
    return {}
  }
}

// Simpan data pertarungan
const saveBattleData = (data) => {
  try {
    fs.writeFileSync(BATTLE_DB, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(chalk.red(`[${getTime()}] Error Saving Battle Data :`), error)
    return false
  }
}

// Calculate damage based on element effectiveness
function hitungDamage(dmg, atkElem, defElem) {
  const counter = {
    api: { lemah: "air", kuat: "tanah" },
    air: { lemah: "listrik", kuat: "api" },
    tanah: { lemah: "api", kuat: "listrik" },
    listrik: { lemah: "tanah", kuat: "air" },
  }

  let effectiveness = "normal"

  if (counter[atkElem]?.kuat === defElem) {
    effectiveness = "strong"
    return { damage: Math.floor(dmg * 1.2), effectiveness }
  }
  if (counter[atkElem]?.lemah === defElem) {
    effectiveness = "weak"
    return { damage: Math.floor(dmg * 0.8), effectiveness }
  }
  return { damage: dmg, effectiveness }
}

const modzbotz = async (m, { modz, args, command }) => {
  // Clean up sender ID to ensure consistency
  const sender = m.sender // biarkan dalam format lengkap
  const users = loadUserData()
  const battles = loadBattleData()

  // .fight @tag - Challenge another player to a battle
  if (command === "fight") {
    const opponent = m.mentionedJid[0]
    if (!opponent) {
      return await replyModz(`*Tag Lawanmu!*\n\n*Contoh :*\n.fight @Target`)
    }

    // Clean up opponent ID
    const opponentId = opponent.endsWith("@s.whatsapp.net") ? opponent : opponent + "@s.whatsapp.net"

    // Check if both players have monsters
    if (!users[sender]?.koleksi?.length) {
      return await replyModz("Kamu Belum Punya Monster. Beli Monster Dengan Ketik .beli, Atau Kamu Bisa Lihat Toko Dengan Ketik .toko")
    }

    if (!users[opponentId]?.koleksi?.length) {
      return await replyModz("Lawan Belum Punya Monster. Suruh Dia Beli Monster Dulu")
    }

    // Check if either player is already in a battle
    if (battles[sender] || battles[opponentId]) {
      return await replyModz("Salah Satu Pemain Sedang Dalam Pertarungan")
    }

    // Store the challenge temporarily
    pendingBattles[opponentId] = {
      challenger: sender,
      timestamp: Date.now(),
    }

    // Send challenge notification
await modz.sendMessage(m.chat, {
  text: `@${opponent.replace(/@.+/, "")} Ditantang Bertarung Oleh @${m.sender.replace(/@.+/, "")}!\n\nBalas Dengan .yes Untuk Menerima Atau .no Untuk Menolak`,
  mentions: [opponent, m.sender],
}, { quoted: m })
  }

  // .y/.n - Accept or reject a battle challenge
  else if (command === "yes" || command === "n") {
    const challenge = pendingBattles[sender]
    if (!challenge) {
      return await replyModz("Tidak Ada Tantangan Yang Menunggumu")
    }

    // Remove the challenge after response
    delete pendingBattles[sender]

    // If rejected
    if (command === "no") {
      return modz.sendMessage(m.chat, {
  text: `@${m.sender.replace(/@.+/, "")} Menolak Tantangan`,
  mentions: [challenge.challenger],
}, { quoted: m })
    }

    // If accepted
    const opponent = challenge.challenger

    // Double-check if either player is already in a battle
    if (battles[opponent] || battles[sender]) {
      return await replyModz("Salah Satu Pemain Sedang Dalam Pertarungan Lain")
    }

    // Get the first monster from each player's collection
    const myMon = users[sender].koleksi[0]
    const opMon = users[opponent].koleksi[0]

    // Create battle data
    const battle = {
      player1: opponent,
      player2: sender,
      mon1: opMon,
      mon2: myMon,
      hp1: 100,
      hp2: 100,
      turn: opponent, // Challenger goes first
      log: [],
    }

    // Store battle data for both players
    battles[opponent] = battle
    battles[sender] = battle
    saveBattleData(battles)

    // Send battle start notification
    await modz.sendMessage(m.chat, {
  text: `*Pertarungan Dimulai!*\n\n${getElementEmoji(opMon.elemen)} ${opMon.nama} vs ${myMon.nama} ${getElementEmoji(myMon.elemen)}\n\n@${opponent.replace(/@.+/, "")} Silakan Gunakan .skill 1/2/3`,
  mentions: [opponent],
}, { quoted: m })
  }

  // .skill <angka> - Use a skill in battle
  else if (command === "skill") {
    const skillIndex = Number.parseInt(args[0]) - 1
    if (isNaN(skillIndex) || skillIndex < 0 || skillIndex > 2) {
      return await replyModz("Gunakan .skill 1, 2, Atau 3")
    }

    // Check if player is in a battle
    const battle = battles[sender]
    if (!battle) {
      return await replyModz("Kamu Tidak Sedang Dalam Pertarungan")
    }

    // Check if it's player's turn
    if (battle.turn !== sender) {
      return await replyModz("Bukan Giliran Kamu!")
    }

    // Determine which monster belongs to the player
    const isPlayer1 = battle.player1 === sender
    const myMon = isPlayer1 ? battle.mon1 : battle.mon2
    const opMon = isPlayer1 ? battle.mon2 : battle.mon1
    const myHP = isPlayer1 ? "hp1" : "hp2"
    const opHP = isPlayer1 ? "hp2" : "hp1"

    // Get the selected skill
    const skill = myMon.skill[skillIndex]
    if (!skill) {
      return await replyModz("Skill Tidak Ditemukan!")
    }

    // Calculate damage based on element effectiveness
    const rawDmg = skill.damage
    const { damage: dmg, effectiveness } = hitungDamage(rawDmg, myMon.elemen, opMon.elemen)

    // Apply damage
    battle[opHP] -= dmg
    if (battle[opHP] < 0) battle[opHP] = 0

    // Add effectiveness indicator
    let effectivenessMsg = ""
    let effectivenessEmoji = ""
    if (effectiveness === "strong") {
      effectivenessMsg = " (Efektif!)"
      effectivenessEmoji = "⚡"
    } else if (effectiveness === "weak") {
      effectivenessMsg = " (Kurang Efektif)"
      effectivenessEmoji = "🕳️"
    }

    // Add to battle log
    battle.log.push(`@${sender} Pakai *${skill.nama}* → -${dmg} HP${effectivenessMsg}`)

    // Check for victory
    if (battle.hp1 <= 0 || battle.hp2 <= 0) {
      const winner = battle.hp1 > 0 ? battle.player1 : battle.player2
      const loser = battle.hp1 > 0 ? battle.player2 : battle.player1
      const monWin = battle.hp1 > 0 ? battle.mon1.nama : battle.mon2.nama

      // Create battle summary
      let battleSummary = `*Pertarungan Selesai!*\n\n`
      battleSummary += `*Pemenang :* @${winner}\n*Monster :* ${monWin}\n\n`
      battleSummary += `*Log Pertarungan :*\n${battle.log.join("\n")}`

      // Send battle results
      await modz.sendMessage(m.chat, {
  text: battleSummary,
  mentions: [winner, loser],
}, { quoted: m })

      // Remove battle data
      delete battles[battle.player1]
      delete battles[battle.player2]
      saveBattleData(battles)
      return
    }

    // Switch turns
    const nextTurn = battle.player1 === sender ? battle.player2 : battle.player1
    battle.turn = nextTurn

    // Update battle data for both players
    battles[battle.player1] = battle
    battles[battle.player2] = battle
    saveBattleData(battles)

    // Send battle update
    await modz.sendMessage(m.chat, {
  text: `${getElementEmoji(myMon.elemen)} @${sender.replace(/@.+/, "")} Menyerang Dengan *${skill.nama}*! ${effectivenessEmoji}\n\n@${nextTurn.replace(/@.+/, "")} Giliranmu. Gunakan .skill 1/2/3\n\n*Status HP:*\n${battle.mon1.nama}: ${battle.hp1} HP\n${battle.mon2.nama}: ${battle.hp2} HP`,
  mentions: [sender, nextTurn],
}, { quoted: m })
  }
}

modzbotz.help = ["fight <@tag>", "skill 1/2/3", "yes", "no"]
modzbotz.tags = ["rpg"]
modzbotz.command = ["fight", "skill", "yes", "no"]
modzbotz.unreg = true

export default modzbotz
