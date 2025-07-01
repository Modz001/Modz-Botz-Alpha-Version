import fs from 'fs'
import https from 'https'

const modzbotz = async (m, { modz }) => {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const dependencies = pkg.dependencies || {}

  await await replyModz('Mengecek Versi Terbaru Dari NPM Registry\n\n*Tunggu Sebentar...*')

  let pesan = '*『 Rekomendasi Update Dependencies 』*\n\n'
  let total = 0

  const getLatestVersion = (pkgName) => {
    return new Promise((resolve) => {
      https.get(`https://registry.npmjs.org/${pkgName}`, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            const json = JSON.parse(data)
            resolve(json['dist-tags'].latest || null)
          } catch {
            resolve(null)
          }
        })
      }).on('error', () => resolve(null))
    })
  }

  for (const [pkgName, currentVersion] of Object.entries(dependencies)) {
    const latest = await getLatestVersion(pkgName)
    if (latest && !currentVersion.includes(latest)) {
      total++
      pesan += `*${pkgName}*\n`
      pesan += `*Sekarang :* ${currentVersion}\n`
      pesan += `*Latest :* ^${latest}\n`
      pesan += `*Update :* \`npm install ${pkgName}@latest\`\n\n`
    }
  }

  if (total === 0) {
    await replyModz('Semua Dependencies Sudah Versi Terbaru')
  } else {
    await replyModz(pesan.trim())
  }
}

modzbotz.help = ['cekupdatedepensi']
modzbotz.tags = ['owner']
modzbotz.command = ['cekupdatedepensi']
modzbotz.unreg = true

export default modzbotz