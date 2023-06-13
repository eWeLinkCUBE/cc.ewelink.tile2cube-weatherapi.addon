<template>
    <div class="setting">
        <span class="title" @click="getTokenInfo">{{ i18n.global.t('SETTING') }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import GateWayCard from './components/GateWayCard.vue';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index'
const router = useRouter();
onMounted(()=>{
    getTokenInfo();
});

const getTokenInfo =async () =>{
    const res = await api.GetTokenInfo();
    console.log('res----->',res);
}
</script>

<style scoped lang="scss">
.setting {
    padding: 16px;
    .title {
        font-size: 16px;
        font-weight: 600;
    }
    .step-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 80px;
        .step-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 28px;
            text-align: center;
        }
        .step-description {
            font-size: 16px;
            color: rgba(66, 66, 66, 0.5);
            margin-bottom: 4px;
            img {
                display: inline-block;
                width: 20px;
                height: 20px;
                cursor: pointer;
                margin-bottom: 2px;
            }
            .notice {
                width: 18px;
                height: 16px;
                margin-right: 8px;
                margin-bottom: 2px;
            }
        }
    }
    .card-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 24px;
        margin-top: 40px;
        padding: 0 80px;
        .card {
            padding: 16px;
            width: 226px;
            height: 168px;
            box-shadow: 0px 0px 5px 0px rgba(136, 136, 136, 0.25);
            border-radius: 12px 12px 12px 12px;
            img {
                margin: 20px 64px;
            }
        }
        .disabled-card {
            filter: grayscale(100%);
            background: #e8e8ec;
            color: #9e9e9e;
            scale: 1 !important;
            pointer-events: none;
        }

        .card:hover {
            scale: 1.02;
            cursor: pointer;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        }
    }
    .next-step {
        margin-top: 120px;
        text-align: right;
        padding: 0 64px;
        font-size: 16px;
        font-weight: 600;
        .disabled-btn {
            pointer-events: none;
            -webkit-filter: grayscale(100%);
            -moz-filter: grayscale(100%);
            -ms-filter: grayscale(100%);
            -o-filter: grayscale(100%);
            filter: grayscale(100%);
            user-select: none;
        }
    }
    .common-btn {
        width: 120px;
        height: 40px;
    }
}

:deep(.ant-btn) {
    border-radius: 8px 8px 8px 8px;
    border: 1px solid rgba(153, 153, 153, 0.3);
    color: #fff;
}

.rotate {
    animation: rotate 1s linear infinite;
    -webkit-animation: rotate 1s linear infinite; /* Safari and Chrome */
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}
@-webkit-keyframes rotate {
    /* Safari and Chrome */
    100% {
        transform: rotate(360deg);
    }
}
</style>
