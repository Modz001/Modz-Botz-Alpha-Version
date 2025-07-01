let modzbotz = async (m, { args, modz, isPrem }) => {
  if (!isPrem) {
  if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
      global.limits -= 1
  }
    if (!args[0]) return replyModz('*Contoh :*\n.request Buatkan Fitur Lagi')

    let text = args.join(' ')
    let url = 'https://flowfalcon.dpdns.org/imagecreator/ngl?title=Request+Feature&text=' + encodeURIComponent(text)
    let caption = 'Request Fitur ' + text + ' ' + m.sender.split('@')[0]

    await modz.sendMessage('6283163234218@s.whatsapp.net', {
        image: { url },
        caption
    })

    const idch = '120363379975415016@newsletter'
    await modz.sendMessage(idch, {
        image: { url },
        caption: 'Request Fitur'
    })

    await replyModz('Request Kamu Sudah Dikirim. Semoga Dibuatkan Ya!')
    await replyModz(`Limit -1\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
}

modzbotz.help = ['request <teks>']
modzbotz.tags = ['tools']
modzbotz.command = ['request', 'req']
modzbotz.unreg = true

export default modzbotz