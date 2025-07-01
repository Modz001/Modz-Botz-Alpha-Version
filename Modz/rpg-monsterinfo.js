import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import chalk from "chalk"
import moment from "moment-timezone"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database path
const MONSTER_DB = path.join(__dirname, "../lib/database/rpg-monter-monster.json")

// Get current time for logging
const getTime = () => {
  return moment().format("HH:mm:ss")
}

// Get element emoji and name
const getElementInfo = (element) => {
  switch (element) {
    case "api":
      return { emoji: "🔥", name: "Api" }
    case "air":
      return { emoji: "💧", name: "Air" }
    case "tanah":
      return { emoji: "🌍", name: "Tanah" }
    case "listrik":
      return { emoji: "⚡", name: "Listrik" }
    default:
      return { emoji: "❓", name: "Unknown" }
  }
}

// Get tier color and description
const getTierInfo = (tier) => {
  switch (tier) {
    case "S":
      return { emoji: "🔴", name: "S", desc: "Super Rare" }
    case "A":
      return { emoji: "🟠", name: "A", desc: "Rare" }
    case "B":
      return { emoji: "🟡", name: "B", desc: "Uncommon" }
    case "C":
      return { emoji: "🟢", name: "C", desc: "Common" }
    case "D":
      return { emoji: "🔵", name: "D", desc: "Basic" }
    default:
      return { emoji: "⚪", name: "?", desc: "Unknown" }
  }
}

// Load daftar monster
const getMonsters = () => {
  try {
    if (!fs.existsSync(MONSTER_DB)) return []
    return JSON.parse(fs.readFileSync(MONSTER_DB))
  } catch (error) {
    console.error(chalk.red(`[${getTime()}] Error Loading Monster Data :`), error)
    return []
  }
}

const modzbotz = async (m, { modz, args, command }) => {
  const monsters = getMonsters()

  if (!monsters.length) {
    return await replyModz("Daftar Monster Kosong!")
  }

  // If no ID provided, show list of monsters
  if (!args[0]) {
    let teks = "*Daftar Monster*\n\n"
    teks += "Ketik .monsterinfo <Id> Untuk Melihat Detail Monster\n\n"

    // Group monsters by tier
    const monstersByTier = {}
    for (const monster of monsters) {
      if (!monstersByTier[monster.tier]) {
        monstersByTier[monster.tier] = []
      }
      monstersByTier[monster.tier].push(monster)
    }

    // Sort tiers in order: S, A, B, C, D
    const tierOrder = ["S", "A", "B", "C", "D"]

    // Display monsters by tier
    for (const tier of tierOrder) {
      if (monstersByTier[tier] && monstersByTier[tier].length > 0) {
        const tierInfo = getTierInfo(tier)
        teks += `${tierInfo.emoji} *TIER ${tier} (${tierInfo.desc})*\n`

        for (const mon of monstersByTier[tier]) {
          const elementInfo = getElementInfo(mon.elemen)
          teks += `⌬ ${mon.nama} ${elementInfo.emoji} - ID: ${mon.id}\n`
        }

        teks += "\n"
      }
    }

    return await replyModz(teks)
  }

  // Find monster by ID
  const id = args[0].toLowerCase()
  const monster = monsters.find((m) => m.id.toLowerCase() === id)

  if (!monster) {
    return await replyModz("Monster Tidak Ditemukan. Ketik .monsterinfo Tanpa Argumen Untuk Melihat Daftar Monster")
  }

  // Get element and tier info
  const elementInfo = getElementInfo(monster.elemen)
  const tierInfo = getTierInfo(monster.tier)

  // Create detailed monster info
  let teks = `*Detail Monster*\n\n`
  teks += `*Informasi Umum*\n`
  teks += `⌬ Nama: ${monster.nama}\n`
  teks += `⌬ ID: ${monster.id}\n`
  teks += `⌬ Tier: ${tierInfo.emoji} ${tierInfo.name} (${tierInfo.desc})\n`
  teks += `⌬ Elemen: ${elementInfo.emoji} ${elementInfo.name}\n`
  teks += `⌬ Harga: Rp${monster.harga.toLocaleString()}\n\n`

  teks += `*Skill*\n`
  for (let i = 0; i < monster.skill.length; i++) {
    const skill = monster.skill[i]
    teks += `⌬ Skill ${i + 1}: ${skill.nama} (${skill.damage} DMG)\n`
  }

  teks += `\n*Efektivitas Elemen*\n`

  // Add element effectiveness information
  const effectiveness = {
    api: { kuat: "tanah", lemah: "air" },
    air: { kuat: "api", lemah: "listrik" },
    tanah: { kuat: "listrik", lemah: "api" },
    listrik: { kuat: "air", lemah: "tanah" },
  }

  const strongAgainst = getElementInfo(effectiveness[monster.elemen]?.kuat || "")
  const weakAgainst = getElementInfo(effectiveness[monster.elemen]?.lemah || "")

  teks += `Kuat Melawan : ${strongAgainst.emoji} ${strongAgainst.name}\n`
  teks += `Lemah Terhadap : ${weakAgainst.emoji} ${weakAgainst.name}\n`

  return await replyModz(teks)
}

modzbotz.help = ["monsterinfo <id>"]
modzbotz.tags = ["rpg"]
modzbotz.command = ["monsterinfo", "minfo"]
modzbotz.unreg = true

export default modzbotz
