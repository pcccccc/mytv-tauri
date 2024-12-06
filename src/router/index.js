import {createRouter, createWebHashHistory} from 'vue-router';
import useSettingStore from "@/store/modules/setting.js";

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'utils']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
 noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
 icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
 breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
 activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
 }
 */

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
        path: '/play',
        name: 'Play',
        component: () => import('@/views/play/index.vue'),
    }, {
        path: '/haha',
        name: 'Haha',
        component: () => import('@/views/play/test.vue'),
    },
    {
        path: '/channels',
        name: 'Channels',
        component: () => import('@/views/channel/index.vue'),
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
    // if(to.fullPath === '/index'){
    useSettingStore().setConfigJs();
    await useSettingStore().getSetting();
    // useSettingStore().reloadEpgFiles();
    // }
    // 可以在这里进行一些全局的路由处理
    next()
})

export default router;
