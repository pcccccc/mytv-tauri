import {defineConfig} from 'vite'
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            // 将所有对 /api 的请求代理到目标服务器
            '/tv': {
                target: 'http://[2409:8087:3c02:21:0:1:0:100a]:6410', // 目标服务器地址
                changeOrigin: true, // 修改请求头中的 `Origin` 字段
                rewrite: (path) => {
                    console.log('Proxy path:', path);  // 打印代理的路径
                    return path.replace(/^\/tv/, '');
                },// 可选：重写路径
            },
        },
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
