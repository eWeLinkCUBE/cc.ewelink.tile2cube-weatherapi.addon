<template>
    <div class="get-token">
        <!-- 文字 -->
        <section class="container">
            <h2 class="title">{{ $t('GET_GATEWAY_TOKEN') }}</h2>
            <img src="@/assets/img/get_token.png" alt="" />
            <h3 class="click-msg">{{ $t('CLICK_GET_TOKEN') }}</h3>
            <h3 class="allow-msg">{{ $t('CONFIRM_GET_TOKEN') }}</h3>
            <!-- 获取token -->
            <a-button
                type="primary"
                @click="getToken"
                :disabled="tokenInfo.item.cubeTokenValid"
                :loading="countdownStatus"
                :style="dynamicBtnColor"
            >
                <span v-if="countdownStatus && !tokenInfo.item.cubeTokenValid">{{ formatCount(countdownTime) }}</span>
                <span v-else>{{ $t('GET_TOKEN') }}</span>
            </a-button>
        </section>
        <!-- 下一步 -->
        <footer>
            <div class="next-step">
                <a @click="nextStep">{{ $t('NEXT') }} > </a>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue';
import type { ITokenInfo } from '@/api/ts/interface/IWeatherInfo';
import { useRouter } from 'vue-router';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
import moment from 'moment';
const router = useRouter();
onMounted(() => {
    getTokenInfo();
});
/** 获取token信息 */
const getTokenInfo = async () => {
    const res = await api.GetTokenInfo();
    if (res.error === 0 && res.data) {
        tokenInfo.item = res.data;
    } else {
        tokenInfo.item = {
            requestTokenTime: 0,
            cubeTokenValid: false,
        };
    }
};

const dynamicBtnColor = computed(()=>{
    if(tokenInfo.item.cubeTokenValid){
        return { 'color': 'black !important' };
    }
})

/** token信息 */
let tokenInfo = reactive<{item:ITokenInfo}>({item:{
    requestTokenTime: 0,
    cubeTokenValid: false,
}});

/** 300秒的倒计时时间内 */
const countdownStatus = computed(() => {
    const nowTime = moment();
    const seconds = moment(nowTime).diff(moment(tokenInfo.item.requestTokenTime), 'seconds');
    console.log('second------------>',seconds);
    return seconds >= 300 ? false : true;
});

/** 倒计时时间 */
const countdownTime = ref<number>(300);

/** 倒计时定时器 */
const timer: any = null;

/** 开始倒计时 */
const setCutDownTimer = (seconds: number) => {
    countdownTime.value = 300 - seconds;
    if (timer.value) {
        window.clearInterval(timer.value);
    }
    timer.value = window.setInterval(() => {
        if (countdownTime.value > 0) {
            countdownTime.value--;
        } else {
            window.clearInterval(timer.value);
            countdownTime.value = 0;
        }
    }, 1000);
};

/** 下一步 */
const nextStep = () => {
    router.push('/setting');
};

/** 获取token按钮 */
const getToken = async () => {
    // if(tokenInfo.cubeTokenValid || countdownStatus.value)return;
    const res = await api.GetToken();
    if(res.error !== 0){
        //重新将状态变成获取token
        setCutDownTimer(0);
    }
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
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        h2 {
            margin-bottom: 16px;
        }
        img {
            margin-top: 16px;
            margin-bottom: 12px;
            width: 365px;
            height: 279px;
        }
        h3 {
            width: 365px;
            text-align: left;
        }
        :deep(.ant-btn) {
            border-radius: 8px;
            width: 200px;
            height: 40px;
            color: #ffff;
            font-size: 16px;
            margin-top: 24px;
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
            width: 106px;
            height: 32px;
            background-color: rgba(24, 144, 255, 0.2);
            border-radius: 8px;
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
    }
}
</style>
