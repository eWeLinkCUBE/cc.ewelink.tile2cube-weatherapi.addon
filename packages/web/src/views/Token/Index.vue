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
        <footer>
            <div class="next-step" :class="tokenInfo.cubeTokenValid ? 'enable-btn' : ''">
                <a @click="nextStep" :class="tokenInfo.cubeTokenValid ? '' : 'disabled-btn'">{{ $t('NEXT') }} > </a>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { ITokenInfo } from '@/api/ts/interface/IWeatherInfo';
import { useRouter } from 'vue-router';
import { useEtcStore } from '@/store/etc';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
import moment from 'moment';
import { useWeatherStore } from '@/store/weather';
//中文轮播图
import GetToken_zh from '@/assets/img/get_token_zh.png';
import GetToken_en from '@/assets/img/get_token_en.png';
//英文轮播图
import Confirm_zh from '@/assets/img/confirm_zh.png';
import Confirm_en from '@/assets/img/confirm_en.png';
const router = useRouter();
const etcStore = useEtcStore();
const weatherStore = useWeatherStore();
/** 倒计时时间 */
const countdownTime = ref<number>(300);
/** 倒计时定时器 */
const timer = ref<any>(null);
/** 当前语言环境 */
const language = computed(() => etcStore.language === 'zh-cn');
/** 英文轮播图列表 */
const en_autoplayImageList: { imgSrc: string }[] = [{ imgSrc: GetToken_zh }, { imgSrc: Confirm_zh }];
// /** 中文轮播图列表 */
const zh_autoplayImageList: { imgSrc: string }[] = [{ imgSrc: GetToken_en }, { imgSrc: Confirm_en }];

onMounted(async () => {
    await weatherStore.getTokenInfo();
});

watch(
    () => weatherStore.tokenInfo.cubeTokenValid,
    () => {
        if (weatherStore.tokenInfo.cubeTokenValid) {
            clearInterval(timer);
        }
    }
);

const tokenInfo = computed(() => weatherStore.tokenInfo);

/** 开始倒计时 */
const setCutDownTimer = (seconds: number) => {
    countdownTime.value = 300 - seconds;
    if (timer.value) window.clearInterval(timer.value);

    timer.value = window.setInterval(() => {
        if (countdownTime.value > 0) {
            countdownTime.value--;
        } else {
            window.clearInterval(timer.value);
            countdownTime.value = 0;
        }
        console.log('---------------->', countdownTime.value);
    }, 1000);
};

/** 下一步 */
const nextStep = () => {
    if (tokenInfo.value.cubeTokenValid) {
        router.push('/setting');
    }
};

/** 获取token按钮 */
const getToken = async () => {
    if (tokenInfo.value.cubeTokenValid || weatherStore.countdownStatus) return;
    //直接开始倒计时；
    setCutDownTimer(0);
    // 开始获取token
    await api.GetToken();
    // 获取token信息
    await weatherStore.getTokenInfo();
};

/** 格式化时间 */
const formatCount = (count: number) => {
    const min = Math.floor(count / 60);
    const sec = count % 60;
    return `${min}min${sec}s`;
};
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
    footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 71px;
        .next-step {
            font-size: 16px;
            font-weight: 600;
            color: #ffff;
            text-align: center;
            a {
                height: 32px;
                line-height: 32px;
            }
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
        .enable-btn {
            width: 106px;
            height: 32px;
            background: rgba(24, 144, 255, 0.2);
            border-radius: 8px 8px 8px 8px;
        }
    }
}
</style>
