<template>
    <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSseStore } from '@/store/sse';
import { useRouter } from 'vue-router';
import { useEtcStore } from '@/store/etc';
const etcStore = useEtcStore();
const router = useRouter();
const sseStore = useSseStore();

onMounted(() => {

});
</script>
