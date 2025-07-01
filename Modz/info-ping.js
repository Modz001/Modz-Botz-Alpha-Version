let modzbotz = async (m, { modz }) => {
  let start = new Date().getTime()
  await await replyModz("Mengecek Ping...")
  let end = new Date().getTime()

  let responseTime = end - start

  await replyModz(`*Ping!*\n\n*Response Time :* ${responseTime}Ms`)
}

modzbotz.help = ['ping']
modzbotz.tags = ['info']
modzbotz.command = ['ping', 'speed']

export default modzbotz