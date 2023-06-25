<template>
    <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSseStore } from '@/store/sse';
import { useRouter } from 'vue-router';
import { useEtcStore } from '@/store/etc';
import {getQuery} from '@/utils/tools';
const etcStore = useEtcStore();
const router = useRouter();
const sseStore = useSseStore();

onMounted(() => {
    sseStore.startSse();
    judgeLangue();
});

/** 判断当前语言 */
const judgeLangue = () => {
    // console.log('ffffffffffffff',getQuery('http://192.168.31.212:5173/#/card?ihost_env=iHostWebCustomCard&language=en-us'));
    let browserLanguage = window.location.href;
    if (!browserLanguage) {
        browserLanguage = navigator.language;
    }
    if (browserLanguage.includes('zh')) {
        etcStore.languageChange('zh-cn');
    } else {
        etcStore.languageChange('en-us');
    }
    console.log(etcStore.language, '当前语言');
};
</script>

<style></style>
