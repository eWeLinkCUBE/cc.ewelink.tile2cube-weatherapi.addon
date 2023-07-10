<template>
    <div class="get-token">
        <section class="container">
            <h2 class="title">{{ $t('GET_GATEWAY_TOKEN') }}</h2>
            <div class="carousel">
                <a-carousel autoplay>
                    <div class="swiper-item" v-for="(item, index) in language ? zh_autoplayImageList : en_autoplayImageList" :key="index">
                        <img class="swiper-image" :src="item.imgSrc" />
                    </div>
                </a-carousel>
            </div>
            <div class="word">
                <h3 class="click-msg">{{ $t('CLICK_GET_TOKEN') }}</h3>
                <h3 class="allow-msg">{{ $t('CONFIRM_GET_TOKEN') }}</h3>
            </div>
            <a-button
                type="primary"
                @click="getToken"
                :disabled="tokenInfo.cubeTokenValid"
                :loading="weatherStore.countdownStatus"
                :style="tokenInfo.cubeTokenValid ? { color: '#333333 !important' } : {}"
            >
                <span v-if="weatherStore.countdownStatus">{{ formatCount(countdownTime) }}</span>
                <span v-else>{{ tokenInfo.cubeTokenValid ? $t('ALREADY_GET_TOKEN') : $t('GET_TOKEN') }}</span>
            </a-button>
        </section>
        <footer class="footer">
            <a-button :disabled="!tokenInfo.cubeTokenValid" :class="{ 'disabled-btn': !tokenInfo.cubeTokenValid}" type="primary" @click="nextStep">{{ $t('NEXT') }} > </a-button>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { ITokenInfo } from '@/api/ts/interface/IWeatherInfo';
import { useRouter } from 'vue-router';
import { useEtcStore } from '@/store/etc';
import { useSseStore } from '@/store/sse';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
import moment from 'moment';
import { emitter } from '@/main';
import { useWeatherStore } from '@/store/weather';
//Chinese carousel
import tokenZhImg from '@/assets/img/get_token_zh.png';
import tokenEnImg from '@/assets/img/get_token_en.png';
//english carousel
import confirmZhImg from '@/assets/img/confirm_zh.png';
import confirmEnImg from '@/assets/img/confirm_en.png';
const router = useRouter();
const etcStore = useEtcStore();
const weatherStore = useWeatherStore();
const sseStore = useSseStore();
/** countdown time */
const countdownTime = ref<number>(300);
/** countdown timer */
const timer = ref<any>(null);
/** current locale */
const language = computed(() => etcStore.language === 'zh-cn');
/** English carousel list */
const en_autoplayImageList: { imgSrc: string }[] = [{ imgSrc: tokenEnImg }, { imgSrc: confirmEnImg }];
/** Chinese carousel list */
const zh_autoplayImageList: { imgSrc: string }[] = [{ imgSrc: tokenZhImg}, { imgSrc:  confirmZhImg }];

onMounted(() => {
    sseStore.startSse();
    weatherStore.getTokenInfo();
});

const tokenInfo = computed(() => weatherStore.tokenInfo);

watch(()=>weatherStore.countdownStatus,(newValue, oldValue) => {
    if(!newValue){
        // console.log('!newValue--------->',!newValue,timer.value);
        clearInterval(timer.value);
    }
});

/** start cutdown */
const setCutDownTimer = (seconds: number) => {
    countdownTime.value = 300 - seconds;
    if (timer.value) window.clearInterval(timer.value);

    timer.value = window.setInterval(() => {
        if (countdownTime.value > 0) {
            countdownTime.value--;
        } else {
            window.clearInterval(timer.value);
            countdownTime.value = 0;
            weatherStore.getTokenInfo();
        }
    }, 1000);
};

/** next button */
const nextStep = () => {
    if (!tokenInfo.value.cubeTokenValid)return;
    clearInterval(timer.value);
    router.push('/setting');
};

/** Send a request to get token */
const getToken = () => {
    if (tokenInfo.value.cubeTokenValid || weatherStore.countdownStatus) return;
    setCutDownTimer(0);
    api.sendRequestGetToken();
};

/** format time */
const formatCount = (count: number) => {
    const min = Math.floor(count / 60);
    const sec = count % 60;
    return `${min}min${sec}s`;
};

emitter.on('cutdown', (time: number) => {
    setCutDownTimer(time);
});
</script>

<style scoped lang="scss">
.get-token {
    padding: 18px;
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #424242;
    }
    .carousel {
        width: 365px;
        height: 279px;
        margin: 0 auto;
        .swiper-item {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            img {
                height: 100%;
            }
        }
        :deep(.ant-carousel .slick-dots li button) {
            width: 8px;
            height: 8px;
            margin-right: 8px;
            background-color: #bbbbbb;
            border-radius: 50%;
        }

        :deep(.slick-dots-bottom) {
            bottom: 23px;
        }

        :deep(.ant-carousel .slick-dots .slick-active button) {
            background-color: #1890ff;
            margin-right: 8px;
        }
    }
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
            margin: 16px 0 12px 0;
            width: 365px;
            height: 279px;
        }
        .word {
            margin: 26px 0 24px 0;
            h3 {
                width: 365px;
                text-align: left;
                white-space: nowrap;
            }
        }
        :deep(.ant-btn) {
            border-radius: 8px;
            width: 200px;
            height: 40px;
            color: #ffff;
            font-size: 16px;
        }
    }
    .footer {
        text-align: right;
        margin-top: 100px;
        :deep(.ant-btn) {
            height: 32px;
            background: rgba(24, 144, 255, 0.2);
            border-radius: 4px;
            border: none;
            font-size: 16px;
            color:#1890ff;
        }
        .disabled-btn{
            opacity: 0.5;
        }
    }
}
</style>
