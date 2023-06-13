<template>
    <div>
        <a-spin
            style="min-height:100vh;background-color:rgba(34,34,34,0.6);color:#FFFF;"
            :indicator="indicator"
            :tip="i18n.global.t('SYNC_ALL_DEVICE_WAIT')"
            size="large"
        >
            <Header />
            <DeviceList />
        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { useEtcStore } from '@/store/etc';
import { message } from 'ant-design-vue';
import { LoadingOutlined } from '@ant-design/icons-vue';
import i18n from '@/i18n';
import api from '@/api';
const etcStore = useEtcStore();
const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '24px',
    },
    spin: true,
});
onMounted(async () => {
});
</script>

<style scoped lang="scss">
</style>
