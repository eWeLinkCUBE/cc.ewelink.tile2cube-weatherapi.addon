import { createRouter, createWebHashHistory } from 'vue-router'
import Token from '@/views/Token/Index.vue'
import Setting from '@/views/Setting/Index.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/setting'
        },
        {
            path:'/setting',
            name:'setting',
            component: Setting,
        },
        {
            path:'/token',
            name:'token',
            component: Token,
        }
    ]
})

router.beforeEach((to, from) => {

});

export default router
