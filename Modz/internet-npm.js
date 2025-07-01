import fetch from 'node-fetch';

let modzbotz = async (m, {
    modz,
    usedPrefix,
    command,
    text,
    isPrem
}) => {
   if (!isPrem) {
   if (global.limits < 1) return replyModz('Limit Kamu Sudah Habis. Silakan Tunggu 24 Jam, Atau Beli Premium Ke Owner Untuk Mendapatkan Akses Tanpa Batas')
    global.limits -= 3
  }
    if (!text) return await replyModz(`Masukkan URL/Query-Nya\n\n*Contoh :*\n${usedPrefix + command} baileys-pro`);
    if (text.includes('www.npmjs.com')) {
        const isDownload = m.args.includes('--download');

        if (isDownload) {
            let input = text.split(" --download").join("");
            const [link, version] = input.split(' ');
            const match = new URL(link);
            const packageName = match.pathname.split('/')[2];

            const result = await fetch(`https://registry.npmjs.org/${packageName}`).then(a => a.json());
            const file = await fetch(result.versions[version].dist.tarball).then(a => a.arrayBuffer());

            const matchh = new URL(link);
            const packageNamee = match.pathname.split('/')[2];
            modz.sendMessage(m.chat, {
                document: Buffer.from(file),
                mimetype: 'application/gzip',
                fileName: packageNamee + `.gzip`
            }, {
                quoted: m
            });
        } else {
            const match = new URL(text);
            const packageName = match.pathname.split('/')[2];
            const result = await fetch('https://registry.npmjs.org/' + packageName).then(a => a.json());
            const versions = Object.keys(result.versions);

            let caption = `*Detail Package Versions*\n`;
            caption += `*Latest :* ${result['dist-tags'].latest}\n`;
            caption += `*Updated :* ${new Date(result.time.modified).toLocaleDateString()}\n\n`;
            caption += `*Version History :*\n`;
            caption += '╔━━━━━━━━━━━━━━━╗\n';

            versions.forEach((ver, i) => {
                const isLast = i === versions.length - 1;
                caption += `${isLast ? '╚━ ' : '╠━ '}${ver}\n`;
            });
            caption += `\nDownload File Ketik .npm <Link> <Versions> --download\n`
            caption += `"All Versions Available For Your Demonic Needs!" - Modz`;

            await modz.reply(m.chat, caption, m);
        }
    } else {
        const search = await fetch(`https://registry.npmjs.org/-/v1/search?text=${text}`).then(a => a.json());

        let caption = `*NPM Package Search Results*\n`;
        caption += `*Search Query :* baileys\n\n`;

        search.objects.forEach((pkg, index) => {
            caption += `*Package ${index + 1} :* ${pkg.package.name}\n`;
            caption += `*Description :* ${pkg.package.description || 'No description'}\n`;
            caption += `*Keywords :* ${pkg.package.keywords?.join(', ') || 'None'}\n`;
            caption += `*Version :* ${pkg.package.version}\n`;
            caption += `*Last Updated :* ${new Date(pkg.package.date).toLocaleDateString()}\n`;
            caption += `*Links :*\n`;
            caption += `   ⌬ npm: https://www.npmjs.com/package/${pkg.package.name}\n`;
            if (pkg.package.links?.repository) {
                caption += `   ⌬ Repo : ${pkg.package.links.repository}\n`;
            }
            if (pkg.package.links?.homepage) {
                caption += `   ⌬ Homepage : ${pkg.package.links.homepage}\n`;
            }
            caption += `\n❆═━━━━━━━━━━━━━━═❆\n`;
        });

        modz.sendMessage(m.chat, {
            text: caption
        }, search.objects.map((pkg, index) => ({
            alias: `${index + 1}`,
            response: `${usedPrefix + command} https://www.npmjs.com/package/${pkg.package.name}`
        })), m);
        replyModz(`Limit -3\nSisa Limit Kamu : ${isPrem ? 'Unli' : global.limits}`)
    }
}

modzbotz.command = ['npm']
modzbotz.help = ['npm <url/query>']
modzbotz.tags = ['internet']
modzbotz.unreg = true
modzbotz.limit = true

export default modzbotz;