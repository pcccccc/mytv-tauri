import {defineConfig} from 'vite'
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), AutoImport({
        imports: ["vue", "vue-router"],
        dts: 'src/auto-import.d.ts'
    }),],
    server: {
        proxy: {},
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, 'src'),
            },
        ],
        extensions: ['.ts', '.js', '.vue'],
    },
})
