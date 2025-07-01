import { Sticker } from 'wa-sticker-formatter'
import axios from 'axios'

/**
 * Kirim gambar sebagai stiker WhatsApp.
 * @param {Object} modz - objek koneksi utama (yang punya method sendMessage)
 * @param {string} chatId - ID chat (contoh: m.chat)
 * @param {string|Buffer} image - URL atau Buffer gambar
 * @param {Object} m - pesan yang dijadikan quoted
 * @param {Object} options - { packname, author }
 */
const sendImageAsSticker = async (modz, chatId, image, m, options = {}) => {
  if (!modz?.sendMessage || typeof modz.sendMessage !== 'function') {
    console.error("❌ Objek modz tidak valid. Tidak ada method sendMessage.")
    throw new Error("Objek modz tidak valid (sendMessage tidak ditemukan)")
  }

  try {
    let buffer;

    if (typeof image === 'string') {
      const res = await axios.get(image, { responseType: 'arraybuffer' });
      buffer = res.data;
    } else if (Buffer.isBuffer(image)) {
      buffer = image;
    } else {
      throw new Error("Image harus berupa URL atau Buffer");
    }

    const sticker = new Sticker(buffer, {
      pack: options.packname || info.stickpack || 'Sticker Bot',
      author: options.author || info.stickauth || 'Bot',
      type: 'full',
      quality: 100,
    });

    const stickerBuffer = await sticker.toBuffer();
    await modz.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: m });
  } catch (e) {
    console.error("❌ Gagal mengirim stiker:", e.message);
    await modz.sendMessage(chatId, { text: 'Gagal mengirim stiker.' }, { quoted: m });
  }
}

export default sendImageAsSticker;