import {invoke} from "@tauri-apps/api/core";

export class InjectJSClass {
    label = null;
    channelInfo = {};

    constructor(label, channelInfo) {
        this.label = label;
        this.channelInfo = channelInfo;
        this.injectChannelBehaviorScript(channelInfo)
    }

    baseScript() {
        return `
        window.browserLabel = '${this.label}';
        ${this.addImport()}
        ${this.addStyle()}
        console.log('初始化${this.label}窗口完成！');
                window.__TAURI__.event.emit('listen-channel-default-event', {
                  type:'init',
                   label:window.browserLabel,
                  content: '初始化${this.label}窗口完成！'
                }).catch(e => {
                  console.log(e)
                });
        `;
    }

    addImport() {
        return `const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.1/css/fontawesome.min.css';
            document.head.appendChild(fontAwesome);
            const fontAwesomeJs = document.createElement('script');
            fontAwesomeJs.src = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.1/js/all.min.js';
            document.head.appendChild(fontAwesomeJs);`
    }

    addStyle() {
        return `
        const style = document.createElement('style');
        style.textContent = \`
                video {pointer-events: none;}
                
                .control-center {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    gap: 20px;
                    padding: 15px;
                    border-radius: 10px;
                    z-index: 9999999999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    justify-content: center;
                    background: linear-gradient(0deg, #fff, transparent);
                }
                
                .control-center:hover {
                    opacity: 1;
                }
                
                .control-button {
                    border: 2px solid white;
                    border-radius: 50%;
                    background-color: transparent;
                    color: white;
                    cursor: pointer;
                    font-size: 20px;
                    transition: all 0.3s ease;
                    width: 40px;
                    height: 40px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .control-button:hover {
                    background-color: white;
                    color: black;
                }
            \`;
        document.head.appendChild(style);`
    }

    addEventListener() {
        return `
            jumpButton.addEventListener('click', () => {
                window.__TAURI__.event.emit('listen-channel-default-event', {
                    label:window.browserLabel,
                    type: 'jump'
                }).catch(e => {
                    console.log('跳转事件出错:', e);
                });
            });
             fullscreenButton.addEventListener('click', () => {
                window.__TAURI__.event.emit('listen-channel-default-event', {
                    label:window.browserLabel,
                    type: 'full'
                }).catch(e => {
                    console.log('跳转事件出错:', e);
                });
            });
            `
    }

    /**
     * 添加遮罩
     * @returns {string}
     */
    addOverlay() {
        return `;const overlay = document.createElement('div');
            overlay.className = 'page-overlay';
            document.body.appendChild(overlay);`
    }

    /**
     * 添加控制中心
     * @returns {string}
     */
    addControlCenter() {
        return `
            ;// 创建控制中心
            const controlCenter = document.createElement('div');
            controlCenter.className = 'control-center';

            // 创建按钮
            const jumpButton = document.createElement('div');
            jumpButton.className = 'control-button'; 
            jumpButton.title = '跳转至官网'; 
            const jumpButtonIcon = document.createElement('i');
            jumpButtonIcon.className = 'fa-solid fa-link';
            jumpButton.appendChild(jumpButtonIcon);

            const fullscreenButton = document.createElement('div');
            fullscreenButton.className = 'control-button';
            jumpButton.title = '切换全屏状态'; 
            const fullscreenButtonIcon = document.createElement('i');
            fullscreenButtonIcon.className = 'fa-solid fa-expand';
            fullscreenButton.appendChild(fullscreenButtonIcon);

            // 添加按钮到控制中心
            controlCenter.appendChild(jumpButton);
            controlCenter.appendChild(fullscreenButton);
            document.body.appendChild(controlCenter);`
    }

    createDOMObserverScript(selector, actionCallback, hasBaseScript = true) {
        let obId = new Date().getTime();
        return `;
  (function() { 
        ${hasBaseScript ? this.baseScript() : ''}  
        const observer${obId} = new MutationObserver((mutations, obs) => {
            const element = document.querySelector('${selector}');
            if (element) {
                obs.disconnect();
                ${actionCallback}
            }
        });
        observer${obId}.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    })()`;
    }

    async injectChannelBehaviorScript() {
        let allJs;
        switch (this.channelInfo.group) {
            case "CCTV":
                allJs = this.createDOMObserverScript(
                    '#player_pagefullscreen_player',
                    `document.querySelector('#player_pagefullscreen_player').click();
                                  document.querySelector('#pic_in_pic_player').remove();
                                  // 默认网页全屏按钮加载完毕 = 全屏按钮加载完毕
                                  let player_fullscreen_player = document.querySelector('#player_fullscreen_player')
                                  player_fullscreen_player.addEventListener('click', (e) => {
                                    e.preventDefault(); 
                                    e.stopPropagation();
                                    const isFullscreen = JSON.parse(player_fullscreen_player.getAttribute('isfullscreen'));
                                    console.log(isFullscreen);
                                    window.__TAURI__.event.emit('listen-channel-default-event', {
                                        label:window.browserLabel,
                                        type: 'full',
                                        isFullscreen
                                    }).then(e=>{
                                        player_fullscreen_player.setAttribute('isfullscreen',!isFullscreen)
                                    }).catch(e => {
                                        console.log('跳转事件出错:', e);
                                    });
                                }, true); `
                );
                break;
            case "fengshows":
                if (this.channelInfo.id == 'fh-news') {
                    allJs = '';
                } else if (this.channelInfo.id == 'fh-zh') {
                    allJs = this.createDOMObserverScript(
                        `.fs-live-banner-cluster-schedule-station[fs-title="中文台"]`,
                        `document.querySelector('.fs-live-banner-cluster-schedule-station[fs-title="中文台"]').click();`,
                        false
                    );
                } else if (this.channelInfo.id == 'fh-hk') {
                    allJs = this.createDOMObserverScript(
                        `.fs-live-banner-cluster-schedule-station[fs-title="香港台"]`,
                        `document.querySelector('.fs-live-banner-cluster-schedule-station[fs-title="香港台"]').click();`,
                        false
                    );
                }
                allJs += this.createDOMObserverScript(
                    '.vjs-controlbar-fullscreen',
                    `
                    document.querySelector('.vjs-controlbar-fullscreen').click();
                    document.querySelector('.vjs-icon-pictureinpicture').style.display = 'none';
                    document.querySelector('.vjs-controlbar-fullscreen').style.display = 'none';

                    const fullButton = document.createElement('div');
                    fullButton.className = 'kaze-controlbar-fullscreen vjs-icon-fullscreen';
                    fullButton.style.fontSize = '20px';
                    fullButton.title = '全屏'; 
                    fullButton.setAttribute('isfullscreen', 'false');
                    document.querySelector('.vjs-controlbar').append(fullButton);
                    let player_fullscreen_player = document.querySelector('.kaze-controlbar-fullscreen')
                    player_fullscreen_player.addEventListener('click', (e) => {
                      e.preventDefault(); 
                      e.stopPropagation();
                      const isFullscreen = JSON.parse(player_fullscreen_player.getAttribute('isfullscreen'));
                      console.log(isFullscreen);
                      window.__TAURI__.event.emit('listen-channel-default-event', {
                          label:window.browserLabel,
                          type: 'full',
                          isFullscreen
                      }).then(e=>{
                      if(isFullscreen){
                            player_fullscreen_player.classList.remove('vjs-icon-exit-fullscreen')
                      }else{
                          player_fullscreen_player.classList.add('vjs-icon-exit-fullscreen')
                      }
                          player_fullscreen_player.setAttribute('isfullscreen',!isFullscreen)
                      }).catch(e => {
                          console.log('跳转事件出错:', e);
                      });
                      });
                    `)
                break;
            case "test":
                console.log('test')
                allJs = this.createDOMObserverScript(
                    '.other-selector',
                    `
                document.querySelector('.other-selector').click();
                `);
                break;
        }
        await invoke('execute_js', {label: this.label, js: allJs});
    }
}