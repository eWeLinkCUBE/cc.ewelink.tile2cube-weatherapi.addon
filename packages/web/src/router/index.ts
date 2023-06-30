import { createRouter, createWebHashHistory } from 'vue-router'
import { useSseStore } from '@/store/sse';

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
    //离开token页面断开sse
    const sseStore = useSseStore();
    if(from.path === '/token' || to.path === 'card'){
        sseStore.closeSse();
    }
});

export default router
