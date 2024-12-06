# IPTV Player

## 项目简介

这是一个基于 Tauri 2 和 Vue 3 开发的现代化电视流媒体播放器应用。支持通过 M3U 地址和 EPG 地址自动解析和播放直播流。

## 技术栈

- **前端**: Vue 3, Vite
- **桌面框架**: Tauri 2
- **UI 组件**: Element Plus
- **状态管理**: Pinia
- **样式**: Tailwind CSS

## 功能特性

- 输入 M3U 地址自动解析频道列表
- 支持 EPG 节目指南
- 跨平台桌面应用
- 响应式设计

## 预想功能

- [x] 能添加单个频道
- [x] 频道能分组
- [ ] 使用DynamicScroller解决列表卡顿
- [x] 能同时播放多个频道
- [ ] 能全屏播放，且在全屏播放下有界面
- [ ] 特定的台如果源有问题直接访问网站来播放
- [ ] 添加源的有效性检测
- [ ] 录制节目
- [ ] 读取音频流添加字幕&翻译
- [ ] 界面更好看
- [ ] IPv6和IPv4的判定

## 开源致谢

感谢以下开源项目和库的贡献：

### 框架和开发工具

- [Tauri](https://tauri.app/) - 使用 Web 前端构建轻量级跨平台桌面应用
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 高性能前端构建工具
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库

### UI 和样式

- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Font Awesome](https://fontawesome.com/) - 图标库

### 媒体处理

- [hls.js](https://github.com/video-dev/hls.js) - HLS 流媒体播放库
- [m3u8-parser](https://github.com/videojs/m3u8-parser) - M3U8 解析工具
- [epg-parser](https://github.com/freearhey/epg-parser) - EPG 数据解析库

### 网络和数据请求

- [Axios](https://axios-http.com/) - 基于 Promise 的 HTTP 客户端
- [Reqwest](https://github.com/seanmonstar/reqwest) - Rust HTTP 客户端

### 开发和构建工具

- [Rust](https://www.rust-lang.org/) - 系统编程语言
- [PostCSS](https://postcss.org/) - CSS 转换工具
- [Sass](https://sass-lang.com/) - CSS 预处理器

## 未来贡献者

我们预留了特别的感谢位置，期待未来更多优秀的贡献者加入！

## 特别感谢

在前期不熟练的开发中，碰到的坑，感谢他们帮我解决

- [目棃](https://github.com/BTMuli)
- [Goodjooy](https://github.com/Goodjooy)

## 许可证

MIT

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建应用
npm run tauri build
```

## 贡献

欢迎通过 Issue 和 Pull Request 参与贡献！

*项目持续建设中，感谢每一位开源贡献者！*