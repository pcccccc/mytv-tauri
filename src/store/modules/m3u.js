import {defineStore} from "pinia";
import {BaseDirectory, exists, readFile, readDir, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {Parser} from 'm3u8-parser';


const useM3uStore = defineStore('m3u', {
    state: () => ({
        m3uList: [],
    }),
    actions: {
        async getM3uList() {
            let existsFile = await exists('m3u/', {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let fileList = await readDir('m3u/', {baseDir: BaseDirectory.Resource});
                fileList = fileList.filter(x => x.isFile)
                let m3uList = [];
                for (let i = 0; i < fileList.length; i++) {
                    let m3uFileText = await readTextFile(`m3u/${fileList[i].name}`, {baseDir: BaseDirectory.Resource})
                    m3uList.push(...this.parseM3U8Text(m3uFileText, fileList[i].name));
                }
                this.m3uList = m3uList;
            }
        },
        parseM3U8Text(m3u8Text, source) {
            const parser = new Parser();
            parser.push(m3u8Text);
            parser.end();

            function parseM3ULine(line) {
                const titleMatch = line.match(/,(.+)$/);
                const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
                const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
                const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
                const groupTitleMatch = line.match(/group-title="([^"]+)"/);
                const kazeIdMatch = line.match(/kaze-id="([^"]+)"/);

                return {
                    name: titleMatch ? titleMatch[1] : null,
                    tvgId: tvgIdMatch ? tvgIdMatch[1] : (tvgNameMatch ? tvgNameMatch[1] : null),
                    tvgName: tvgNameMatch ? tvgNameMatch[1] : null,
                    tvgLogo: tvgLogoMatch ? tvgLogoMatch[1] : null,
                    groupTitle: groupTitleMatch ? groupTitleMatch[1] : null,
                    kazeId: kazeIdMatch ? kazeIdMatch[1] : null,
                    source: source.replace(/\.[^.]+$/, '')
                };
            }

            return parser.manifest.segments.map(x => {
                return {
                    ...x,
                    ...parseM3ULine(x.title)
                }
            })
        },
        async addCustomM3uItem(data) {
            let {tvgId, uri, tvgLogo} = data;

            let existsFile = await exists('m3u/iptv-custom-m3u.m3u', {baseDir: BaseDirectory.Resource});
            let m3uList = "";
            if (existsFile) {
                m3uList += await readTextFile('m3u/iptv-custom-m3u.m3u', {baseDir: BaseDirectory.Resource});
                m3uList += "\n";
            }
            m3uList += `#EXTINF:-1 tvg-id="${tvgId}" kaze-id="${new Date().getTime()}" tvg-name="${tvgId}" ${tvgLogo ? `tvg-logo="${tvgLogo}"` : ""},${tvgId}
                    ${uri}`;
            await writeTextFile('m3u/iptv-custom-m3u.m3u', m3uList, {baseDir: BaseDirectory.Resource});
        },
        async removeCustomM3uItem(kazeId) {
            let list = await this.getCustomM3uList();
            list = list.filter(x => x.kazeId !== kazeId);
            let m3uList = "";
            list.forEach(x => {
                m3uList += `#EXTINF:-1 tvg-id="${x.tvgId}" kaze-id="${x.kazeId}" tvg-name="${x.tvgName}" ${x.tvgLogo ? `tvg-logo="${x.tvgLogo}"` : ""},${x.tvgId}
                    ${x.uri}`;
            });
            await writeTextFile('m3u/iptv-custom-m3u.m3u', m3uList, {baseDir: BaseDirectory.Resource});
        },
        async getCustomM3uList() {
            let existsFile = await exists('m3u/iptv-custom-m3u.m3u', {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let m3uFileText = await readTextFile('m3u/iptv-custom-m3u.m3u', {baseDir: BaseDirectory.Resource})
                return this.parseM3U8Text(m3uFileText, 'iptv-custom-m3u.m3u')
            } else {
                return [];
            }
        },
    },
})

export default useM3uStore;