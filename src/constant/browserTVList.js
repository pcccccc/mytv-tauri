// 网页电视的列表
export const browserTVList = [
    {
        "name": "CCTV-1 综合",
        "url": "https://tv.cctv.com/live/cctv1/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-2 财经",
        "url": "https://tv.cctv.com/live/cctv2/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-3 综艺",
        "url": "https://tv.cctv.com/live/cctv3/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-4 中文国际（亚）",
        "url": "https://tv.cctv.com/live/cctv4/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-5 体育",
        "url": "https://tv.cctv.com/live/cctv5/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-5+ 体育赛事",
        "url": "https://tv.cctv.com/live/cctv5plus/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-6 电影",
        "url": "https://tv.cctv.com/live/cctv6/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-7 国防军事",
        "url": "https://tv.cctv.com/live/cctv7/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-8 电视剧",
        "url": "https://tv.cctv.com/live/cctv8/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-9 纪录",
        "url": "https://tv.cctv.com/live/cctvjilu/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-10 科教",
        "url": "https://tv.cctv.com/live/cctv10/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-11 戏曲",
        "url": "https://tv.cctv.com/live/cctv11/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-12 社会与法",
        "url": "https://tv.cctv.com/live/cctv12/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-13 新闻",
        "url": "https://tv.cctv.com/live/cctv13/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-14 少儿",
        "url": "https://tv.cctv.com/live/cctvchild/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-15 音乐",
        "url": "https://tv.cctv.com/live/cctv15/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-16 奥林匹克",
        "url": "https://tv.cctv.com/live/cctv16/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-17 农业农村",
        "url": "https://tv.cctv.com/live/cctv17/",
        "group": "CCTV"
    },
    {
        "name": "CCTV-4 中文国际（欧）",
        "url": "https://tv.cctv.com/live/cctveurope/index.shtml",
        "group": "CCTV"
    },
    {
        "name": "CCTV-4 中文国际（美）",
        "url": "https://tv.cctv.com/live/cctvamerica/",
        "group": "CCTV"
    },
    {
        "name": "凤凰卫视 资讯台",
        "url": "https://www.fengshows.com/live",
        "group": "fengshows",
    },
    {
        "name": "凤凰卫视 中文台",
        "url": "https://www.fengshows.com/live",
        "group": "fengshows",
        "eventList": ['div[fs-title="中文台"]'],// 进入页面后需要先点击的按钮
    },
    {
        "name": "凤凰卫视 香港台",
        "url": "https://www.fengshows.com/live",
        "group": "fengshows",
        "eventList": ['div[fs-title="香港台"]'],
        "proxy": true
    },
];

// 网页电视的网页格式 处理方式
export const browserGroupWebStyleList = [
    {
        name: "CCTV",// 中国中央电视台
        hasProxy: false,// 是否需要翻墙
        fullscreenType: 'id',// 全屏的类型，是id还是class
        fullscreenId: 'player_fullscreen_player',// 全屏的按键id 用click触发或者监听
    },
    {
        name: "fengshows", // 凤凰卫视
        hasProxy: false,
        fullscreenType: 'class',
        fullscreenId: 'vjs-controlbar-fullscreen',
    }
];