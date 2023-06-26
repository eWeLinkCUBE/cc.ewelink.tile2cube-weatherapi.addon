import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/setting'
        },
        {
            path:'/token',
            name:'token',
            component: () => import('@/views/Token/Index.vue'),
        },
        {
            path:'/setting',
            name:'setting',
            component: () => import('@/views/Settings/Index.vue'),
        },
        {
            path:'/card',
            name:'card',
            component: () => import('@/views/Card/Index.vue'),
        }
    ]
})

router.beforeEach((to, from) => {
    //TODO:进入card页面需要判断一下设置页面有没有配置完成
});

export default router
