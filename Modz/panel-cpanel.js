import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'

let modzbotz = async (m, { text, command, modz }) => {
  const { default: fetch } = await import('node-fetch');

  if (!text) return await replyModz(`*Contoh :*\n.${command}Username|Number`);

  let nomor, usernem;
  let tek = text.split(",");
  if (tek.length > 1) {
    let [users, nom] = tek.map(t => t.trim());
    if (!users || !nom) return await replyModz(`*Contoh :*\n.${command}Modz|62831xxx`);
    nomor = nom.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    usernem = users.toLowerCase();
  } else {
    usernem = text.toLowerCase();
    nomor = m.isGroup ? m.sender : m.chat;
  }

  try {
    let onWa = await modz.onWhatsApp(nomor.split("@")[0]);
    if (onWa.length < 1) return await replyModz("Nomor Target Tidak Terdaftar Di WhatsApp!");
  } catch (err) {
    return await replyModz("Gagal Mengecek Nomor WhatsApp : " + err.message);
  }

  const resourceMap = {
    "1gb": { ram: "1000", disk: "1000", cpu: "40" },
    "2gb": { ram: "2000", disk: "1000", cpu: "60" },
    "3gb": { ram: "3000", disk: "2000", cpu: "80" },
    "4gb": { ram: "4000", disk: "2000", cpu: "100" },
    "5gb": { ram: "5000", disk: "3000", cpu: "120" },
    "6gb": { ram: "6000", disk: "3000", cpu: "140" },
    "7gb": { ram: "7000", disk: "4000", cpu: "160" },
    "8gb": { ram: "8000", disk: "4000", cpu: "180" },
    "9gb": { ram: "9000", disk: "5000", cpu: "200" },
    "10gb": { ram: "10000", disk: "5000", cpu: "220" },
    "unlimited": { ram: "0", disk: "0", cpu: "0" },
    "unli": { ram: "0", disk: "0", cpu: "0" }
  };

  let { ram, disk, cpu } = resourceMap[command] || { ram: "0", disk: "0", cpu: "0" };
  let username = usernem;
  let email = username + "@modz.id";
  let name = username.charAt(0).toUpperCase() + username.slice(1) + " Server";
  let password = username + "001";

  try {
    let resUser = await fetch(cpanel.domain + "/api/application/users", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cpanel.apikey
      },
      body: JSON.stringify({
        email, username, first_name: name, last_name: "Server",
        language: "en", password
      })
    });

    let data = await resUser.json();
    if (data.errors) return await replyModz("Error: " + JSON.stringify(data.errors[0], null, 2));
    let user = data.attributes;

    let resEgg = await fetch(`${cpanel.domain}/api/application/nests/${cpanel.nestid}/eggs/${cpanel.egg}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cpanel.apikey
      }
    });

    let data2 = await resEgg.json();
    let startup_cmd = data2.attributes.startup;

    let resServer = await fetch(cpanel.domain + "/api/application/servers", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cpanel.apikey
      },
      body: JSON.stringify({
        name,
        description: "Buyer Modz",
        user: user.id,
        egg: parseInt(cpanel.egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
        startup: startup_cmd,
        environment: {
          INST: "npm", USER_UPLOAD: "0", AUTO_UPDATE: "0", CMD_RUN: "npm start"
        },
        limits: {
          memory: ram, swap: 0, disk, io: 500, cpu
        },
        feature_limits: {
          databases: 5, backups: 5, allocations: 5
        },
        deploy: {
          locations: [parseInt(cpanel.loc)],
          dedicated_ip: false, port_range: []
        }
      })
    });

    let result = await resServer.json();
    if (result.errors) return await replyModz("Error: " + JSON.stringify(result.errors[0], null, 2));

    let server = result.attributes;
    let buyer = nomor;

    let infopanel = `
*❆═━━━━═『 \`𝗜𝗻𝗳𝗼 𝗦𝗲𝗿𝘃𝗲𝗿\` 』═━━┅━═❆*
*⌬ ID Server :* ${server.id}
*⌬ Name Server :* ${name}

*❆═━═『 \`𝗦𝗽𝗲𝘀𝗶𝗳𝗶𝗸𝗮𝘀𝗶 𝗦𝗲𝗿𝘃𝗲𝗿\` 』═━═❆*
*⌬ Ram :* ${ram == "0" ? "Unlimited" : ram / 1000 + "GB"}
*⌬ Disk :* ${disk == "0" ? "Unlimited" : disk / 1000 + "GB"}
*⌬ CPU :* ${cpu == "0" ? "Unlimited" : cpu + "%"}

*❆═━═『 \`𝗦𝘆𝗮𝗿𝗮𝘁 & 𝗞𝗲𝘁𝗲𝗻𝘁𝘂𝗮𝗻\` 』═━═❆*
*⌬ Expired Panel 1 Bulan*
*⌬ Simpan Data Ini Sebaik Mungkin*
*⌬ Garansi Pembelian 10 Hari (1x Replace)*
*⌬ Claim Garansi Wajib Membawa Bukti Chat Pembelian/Struk Transaksi*
`;

const media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/8381kq.jpg' } }, { upload: modz.waUploadToServer });

          const message = generateWAMessageFromContent(buyer, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {},
        interactiveMessage: {
          body: { text: infopanel },
          footer: { text: '© Modz Botz | Akun Panel' },
          header: {
            hasMediaAttachment: true,
            imageMessage: media.imageMessage,
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "Username",
                  copy_code: user.username
               })
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "Password",
                  copy_code: password
             })
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Login",
                  url: `${cpanel.domain}`,
                  merchant_url: "https://www.google.com"
                })
              }
           ]
          }
        }
      }
    }
  }, {quoted: m});

  await modz.relayMessage(buyer, message.message, { messageId: message.key.id });
    await replyModz(`Berhasil Membuat Akun Panel\nData Telah Dikirim Ke ${buyer.split("@")[0]}`);
  } catch (err) {
    return await replyModz("Terjadi Kesalahan : " + err.message);
  }
};

modzbotz.help = ['1gb', '2gb', '3gb', '4gb', '5gb', '6gb', '7gb', '8gb', '9gb', '10gb', 'unli'].map(v => v + ' <username|number>');
modzbotz.tags = ['panel'];
modzbotz.command = /^([1-9]gb|10gb|unlimited|unli)$/i;
modzbotz.reseller = true;
modzbotz.unreg = true;

export default modzbotz;