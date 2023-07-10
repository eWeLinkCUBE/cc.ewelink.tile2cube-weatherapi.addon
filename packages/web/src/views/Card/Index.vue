<template>
    <div style="min-height: 100vh;">
        <component :is="cardType" :foreCastInfo="weatherStore.foreCastInfo" :isDay="isDay" :tempUnit="tempUnit" />
    </div>
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
/** current card type */
const cardType = shallowRef<any>();
/** day or night */
const isDay = ref(false);

/** Corresponding mapping card */
const relationMap: { [key: string]: any } = {
    /** iHost console web environment - custom card, default 1*1 */
    iHostWebCustomCard: SmallCard,
    /** iHost console web environment 2*1 card */
    iHostWebCustomLargeCard: LargeCard,
    /** iHost console web environment - custom card drawer */
    iHostWebCustomCardDrawer: DetailCard,
    /** iHost Cast Environment - Custom Thing Cards */
    iHostCastThingCard: CastCard,
};

/** timer id */
const timer = ref<any>();

onMounted(async () => {
    await getTempUnit();
    await judgeCardType();
    setInterValHandler();
});

onBeforeUnmount(() => {
    clearInterval(timer.value);
});

/** weather poll */
const setInterValHandler = () => {
    clearInterval(timer.value);
    //get current time
    const nowtime = new Date().getTime();
    //get next hour time
    const h = new Date().getHours() + 1;
    // Get the next hour's timestamp
    const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + h * 60 * 60 * 1000 - 1).getTime();
    const timing = end - nowtime + 300000;
    //Get data all the time
    setTimeout(() => {
        timer.value = setInterval(() => {
            weatherStore.getForeCastInfo();
        }, 60 * 60 * 1000);
    }, timing);
};

/** Determine the current card type */
const judgeCardType = async () => {
    const params = getQuery(window.location.href);
    if (params.ihost_env) {
        const res = await weatherStore.getForeCastInfo();
        if (res.error === 0 && res.data) {
            isDay.value = _.get(res.data, ['forecastData', 'current', 'is_day'], 1) === 1; //isDay 1:白天 0:黑夜
            cardType.value = relationMap[params.ihost_env];
            //2*1卡片
            if (window.innerWidth !== window.innerHeight && params.ihost_env === 'iHostWebCustomCard') {
                cardType.value = relationMap['iHostWebCustomLargeCard'];
            }
        }
    }
};

/** true:Celsius,false:Fahrenheit */
const tempUnit = ref<boolean>(true);

/** Get units from config */
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

/** Screen size change re-judgment */
window.addEventListener('resize', () => {
    const params = getQuery(window.location.href);
    if (params.ihost_env && params.ihost_env === 'iHostWebCustomCard') {
        resizeDebounce();
    }
});

/** resize */
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
