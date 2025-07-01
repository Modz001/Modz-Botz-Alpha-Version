import fs from 'fs'

let modzbotz = async (m, { modz, text, usedPrefix, command }) => {
   if (!text) throw `*Contoh :* ${usedPrefix + command} main.js`
   try {
   if (!m.quoted.text) return await replyModz(`Harap Balas Kodenya`)
   let path = `Modz/${text}.js` 
   await fs.writeFileSync(path, m.quoted.text) 
   await replyModz(`Kode Berhasil Tersimpan Di ${path}`)
   } catch (error) {
    console.error(error)
    return await replyModz('Error : ' + error.message)
   }
}
modzbotz.help = ['saveplugin']
modzbotz.tags = ['owner'] 
modzbotz.command = ['sfp', 'sfplugin', 'saveplugin']
modzbotz.rowner = true

export default modzbotz