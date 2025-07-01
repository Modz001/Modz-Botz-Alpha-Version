const gpt1image = async (yourImagination) => {

    const headers = {
        "content-type": "application/json",
        "referer": "https://gpt1image.exomlapi.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
    }

    const body = JSON.stringify({
        "prompt": yourImagination,
        "n": 1,
        "size": "1024x1024",
        "is_enhance": true,
        "response_format": "url"
    })

    const response = await fetch("https://gpt1image.exomlapi.com/v1/images/generations", {
        headers,
        body,
        "method": "POST"
    });

    if (!response.ok) throw Error(`Fetch Gagal Di Alamat ${response.url} ${response.status} ${response.statusText}.`)

    const json = await response.json()
    const url = json?.data?.[0]?.url
    
    if (!url) throw Error("Fetch Berhasil Tapi Url Result Nya Kosong" + (json.error ? ", Error Dari Server : " + json.error : "."))
    
    return url
}

async function modzbotz(m, { modz, text }) {
    if (!text) return await replyModz('*Berikan Desk Gambar Yg Ingin Kamu Buat!*\n\n*Contoh :*\n.gptimage Buatkan Anime Cewek Berambut Biru')
    
    await replyModz('Tunggu Sebentar...')
    
    try {
        const imageUrl = await gpt1image(text)
        
        await modz.sendMessage(m.chat, {
            image: { url: imageUrl },
        }, { quoted: m })
        
    } catch (error) {
        await replyModz(`${error.message}`)
    }
}

modzbotz.help = ['gptimage']
modzbotz.command = ['gptimage', 'aiimage', 'generateimage']
modzbotz.tags = ['ai']
modzbotz.unreg = true
modzbotz.premium = true

export default modzbotz