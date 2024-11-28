import {defineStore} from "pinia";
import {BaseDirectory, exists, readFile, readDir, readTextFile} from "@tauri-apps/plugin-fs";
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
                    // todo 后期可以优化为以文件为组
                    m3uList.push(...this.parseM3U8Text(m3uFileText));
                }
                this.m3uList = m3uList;
            }
        },
        parseM3U8Text(m3u8Text) {
            const parser = new Parser();
            parser.push(m3u8Text);
            parser.end();

            function parseM3ULine(line) {
                const titleMatch = line.match(/,(.+)$/);
                const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
                const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
                const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
                const groupTitleMatch = line.match(/group-title="([^"]+)"/);

                return {
                    name: titleMatch ? titleMatch[1] : null,
                    tvgId: tvgIdMatch ? tvgIdMatch[1] : null,
                    tvgName: tvgNameMatch ? tvgNameMatch[1] : null,
                    tvgLogo: tvgLogoMatch ? tvgLogoMatch[1] : null,
                    groupTitle: groupTitleMatch ? groupTitleMatch[1] : null
                };
            }

            return parser.manifest.segments.map(x => {
                return {
                    ...x,
                    ...parseM3ULine(x.title)
                }
            })
        },
        addM3U8Item(name, url) {
            // 添加独立的链接 然后保存到m3u文件内
        }
    },
})

export default useM3uStore;