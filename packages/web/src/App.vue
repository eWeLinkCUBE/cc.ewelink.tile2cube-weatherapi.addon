<template>
    <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
// import { useSseStore } from '@/store/sse';
import { useRouter } from 'vue-router';
import { useEtcStore } from '@/store/etc';
import {getQuery} from '@/utils/tools';
const etcStore = useEtcStore();
const router = useRouter();
// const sseStore = useSseStore();

onMounted(() => {
    judgeLangue();
    // sseStore.startSse();
});

/** judge locale */
const judgeLangue = () => {
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

<style>
#app{
  min-height:100vh;
}
</style>
