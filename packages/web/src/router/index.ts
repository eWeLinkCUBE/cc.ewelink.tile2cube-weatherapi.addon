import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/token'
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

});

export default router
