import {createRouter, createWebHashHistory} from 'vue-router';
// 公共路由
export const constantRoutes = [
    {
        path: '',
        name: 'Index',
        redirect: '/index',
        children: [{
            path: '/index',
            component: () => import('@/views/index.vue'),
        }]
    },
    {
        path: '/player',
        name: 'Play',
        component: () => import('@/views/player/index.vue'),
    },
    {
        path: '/browserChannels',
        name: 'BrowserChannels',
        component: () => import('@/views/browserParse/index.vue'),
    },
    {
        path: '/channels',
        name: 'Channels',
        component: () => import('@/views/channelList/index.vue'),
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
    },
    {
        path: '/Info',
        name: 'Info',
        component: () => import('@/views/info/index.vue'),
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
    // scrollBehavior(to, from, savedPosition) {
    // 	return { top: 0 };  // 此处返回值应为 PositionDescriptor 类型
    // }
});

// 全局路由监听
router.beforeEach(async (to, from, next) => {
    next()
})

export default router;
