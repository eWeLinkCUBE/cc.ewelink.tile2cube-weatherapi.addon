<template>
    <!-- <a-spin style="min-height: 100vh;min-width:100vw;background-color: rgba(34,34,34,0.6); color: #ffff" :spinning="loading" :indicator="indicator" :tip="'loading'" size="large"> -->
    <div style="min-height: 100vh;">
        <component :is="cardType" :foreCastInfo="weatherStore.foreCastInfo" :isDay="isDay" :tempUnit="tempUnit" />
    </div>
    <!-- </a-spin> -->
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import SmallCard from '@/views/Card/component/SmallCard.vue';
import LargeCard from '@/views/Card/component/LargeCard.vue';
import DetailCard from '@/views/Card/component/DetailCard.vue';
import CastCard from '@/views/Card/component/CastCard.vue';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { getQuery } from '@/utils/tools';
import api from '@/api/Weather/index';
import _ from 'lodash';
import { useWeatherStore } from '@/store/weather';
const weatherStore = useWeatherStore();

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '24px',
    },
    spin: true,
});
/** 当前的卡片类型 */
const cardType = shallowRef<any>();
/** 请求接口loading */
const loading = ref(false);
/** 白天或黑夜 */
const isDay = ref(false);

/** 对应的映射卡片 */
const relationMap: { [key: string]: any } = {
    /** iHost中控台web环境 - 自定义卡片，默认1*1*/
    iHostWebCustomCard: SmallCard,
    /** iHost中控台web环境 2*1卡片 */
    iHostWebCustomLargeCard: LargeCard,
    /** iHost中控台web环境 - 自定义卡片抽屉 */
    iHostWebCustomCardDrawer: DetailCard,
    /** iHost Cast环境 - 自定义Thing卡片 */
    iHostCastThingCard: CastCard,
};

/** 定时器id */
const timer = ref<any>();

onMounted(async () => {
    await getTempUnit();
    await judgeCardType();
    setInterValHandler();
});

onBeforeUnmount(() => {
    clearInterval(timer.value);
});

/** 天气预报轮询 */
const setInterValHandler = () => {
    clearInterval(timer.value);
    //获取当前时间
    const nowtime = new Date().getTime();
    //获取下一个小时
    const h = new Date().getHours() + 1;
    // 获取下一个小时的时间戳
    const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + h * 60 * 60 * 1000 - 1).getTime();
    const timing = end - nowtime + 300000;
    console.log('timing--------------->', timing);
    //整点获取数据
    setTimeout(() => {
        timer.value = setInterval(() => {
            weatherStore.getForeCastInfo();
        }, 60 * 60 * 1000);
    }, timing);
};

/** 判断当前卡片类型 */
const judgeCardType = async () => {
    const params = getQuery(window.location.href);
    if (params.ihost_env) {
        loading.value = true;
        const res = await weatherStore.getForeCastInfo();
        if (res.error === 0 && res.data) {
            isDay.value = _.get(res.data, ['forecastData', 'current', 'is_day'], 1) === 1; //isDay 1:白天 0:黑夜
            cardType.value = relationMap[params.ihost_env];
            //2*1卡片
            if (window.innerWidth !== window.innerHeight && params.ihost_env === 'iHostWebCustomCard') {
                cardType.value = relationMap['iHostWebCustomLargeCard'];
            }
            loading.value = false;
        }
    }
};

/** true:摄氏度,false:华氏度 */
const tempUnit = ref<boolean>(true);

/** 从配置获取单位 */
const getTempUnit = async () => {
    const res = await api.GetSaveData();
    if (res.data && res.error === 0) {
        tempUnit.value = res.data.tempUnit === 'C';
    }
};

watch(
    () => weatherStore.foreCastInfo,
    () => {
        getTempUnit();
        isDay.value = _.get(weatherStore.foreCastInfo, ['forecastData', 'current', 'is_day'], 1) === 1;
    }
);

/** 屏幕尺寸变化重新判断 */
window.addEventListener('resize', () => {
    const params = getQuery(window.location.href);
    if (params.ihost_env && params.ihost_env === 'iHostWebCustomCard') {
        resizeDebounce();
    }
});

/** resize防抖 */
const resizeDebounce = _.debounce(judgeCardType, 1000, {
    leading: true,
    trailing: true,
});
</script>

<style>
.ant-spin-nested-loading > div > .ant-spin .ant-spin-text {
    text-shadow: none;
}
</style>
