let modzbotz = async (m, { modz }) => {
  await await replyModz("Bot Akan Segera Restart...")

  setTimeout(() => {
    process.exit(0)
  }, 2000)
}

modzbotz.help = ["restart"]
modzbotz.tags = ["owner"]
modzbotz.command = ["restart"]
modzbotz.owner = true

export default modzbotz