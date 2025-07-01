import fs from 'fs'
import { createCanvas, loadImage, registerFont } from 'canvas'
import { getBuffer } from './otherfunc.js'
import moment from 'moment-timezone'

registerFont('./fonts/Ethnocentric-Bold.ttf', { family: 'Ethnocentric' })

export async function welcome(iswel, isleft, modz, anu, setting) {
  try {
    const metadata = await modz.groupMetadata(anu.id)
    const participants = anu.participants
    const groupName = metadata.subject
    const jumlahMember = metadata.participants.length

    for (let num of participants) {
      let pp_user
      try {
        pp_user = await modz.profilePictureUrl(num, 'image')
      } catch {
        pp_user = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
      }

      const avatar = await loadImage(pp_user)

      const padding = 20
      const width = 900
      const height = 513
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')

      const background = await loadImage('https://files.catbox.moe/d8yovi.jpg')
      ctx.drawImage(background, 0, 0, width, height)

      // Overlay abu-abu semi transparan
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(padding, padding, width - (padding * 2), height - (padding * 2))

      const offsetY = -80
      const centerX = width / 2
      const centerY = height / 2 + offsetY
      const scale = 0.75
      const radius = 160 * scale

      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(avatar, centerX - radius, centerY - radius, radius * 2, radius * 2)
      ctx.restore()

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2)
      ctx.strokeStyle = '#00FFFF'
      ctx.lineWidth = 10
      ctx.stroke()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 60px Ethnocentric'
      ctx.textAlign = 'center'

      let header = ''
      let title = ''
      let desc = ''

      if (anu.action === 'add') {
        header = 'WELCOME'
        title = 'Selamat Datang'
        desc = `Member Ke-${jumlahMember}`
      } else if (anu.action === 'remove') {
        header = 'GOODBYE'
        title = 'Selamat Tinggal'
        desc = `Member Ke-${jumlahMember}`
      } else if (anu.action === 'promote') {
        header = 'PROMOTED'
        title = 'Selamat Kamu Telah Menjadi'
        desc = `Admin Grup ${groupName}`
      } else if (anu.action === 'demote') {
        header = 'DEMOTED'
        title = 'Kamu Bukan Lagi'
        desc = `Admin Grup ${groupName}`
      }

      ctx.fillText(header, centerX, 360)
      
      ctx.font = '36px Ethnocentric'
      ctx.fillStyle = '#00FFFF'
      ctx.fillText(title, centerX, 400)

      ctx.font = '36px Ethnocentric'
      ctx.fillStyle = '#00FFFF'
      ctx.fillText(desc, centerX, 440)

      const caption = {
        add: `╔━━━═━═━═━━━═❆
┃ *Selamat Datang*
║ @${num.split("@")[0]}
┃ *Di Grup ${groupName}*
╠━━━━━━━━━━━═❆
╚━═『 *Modz* 』═━━═━━═❆`,
        remove: `╔━━━═━═━═━━━═❆
┃ *Selamat Tinggal*
║ @${num.split("@")[0]}
┃ *Dari Grup ${groupName}*
╠━━━━━━━━━━━═❆
╚━═『 *Modz* 』═━━═━━═❆`,
        promote: `╔━━━═━═━═━━━═❆
┃ *Selamat* @${num.split("@")[0]}
║ *Kamu Sudah Di Jadikan*
┃ *Admin Grup ${groupName}*
╠━━━━━━━━━━━═❆
╚━═『 *Modz* 』═━━═━━═❆`,
        demote: `╔━━━═━═━═━━━═❆
┃ *Maaf* @${num.split("@")[0]}
║ *Kamu Di Berhentikan Jadi*
┃ *Admin Grup ${groupName}*
╠━━━━━━━━━━━═❆
╚━═『 *Modz* 』═━━═━━═❆`
      }[anu.action]

const canvasBuffer = canvas.toBuffer()

await modz.sendMessage(anu.id, {
        image: canvasBuffer,
        caption: caption,
        mentions: [num]
      })
    }
  } catch (err) {
    console.error(err)
  }
}
