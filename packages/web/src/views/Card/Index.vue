<template>
    <component :is="cardType" :foreCastInfo="foreCastInfo" :isDay="isDay"/>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SmallCard from '@/views/Card/component/SmallCard.vue';
import LargeCard from '@/views/Card/component/LargeCard.vue';
import DetailCard from '@/views/Card/component/DetailCard.vue';
import CastCard from '@/views/Card/component/CastCard.vue';
import { getQuery } from '@/utils/tools';
import api from '@/api/Weather/index';
import type { IRequestForeCastInfo, IForeCastResultInfo, ICardStyle } from '@/api/ts/interface/IWeatherInfo';
import _ from 'lodash';
import { useWeatherStore } from '@/store/weather';
const weatherStore = useWeatherStore();

/** 当前的卡片类型 */
const cardType = ref<any>();

/** 天气数据 */
const foreCastInfo = ref<IForeCastResultInfo>();

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

onMounted(async () => {
    await judgeCardType();
});

/** 判断当前卡片类型 */
const judgeCardType = async () => {
    const params = getQuery(window.location.href);
    if (params.ihost_env) {
        await getForeCastInfo();
        cardType.value = relationMap[params.ihost_env];
        //2*1卡片
        if (window.innerWidth !== window.innerHeight && params.ihost_env === 'iHostWebCustomCard') {
            cardType.value = relationMap['iHostWebCustomLargeCard'];
        }
    }
};

const isDay = ref(false);

/** 获取天气预报信息 */
const getForeCastInfo = async () => {
    const data: IRequestForeCastInfo = {
        refresh: weatherStore.isChangeCity ? '1' :'0',
        days:5
    };
    const res = await api.getForeCastInfo(data);
    if(res.error === 0 && res.data){
        console.log('res.data--------------->',res.data);
        foreCastInfo.value = res.data;
        isDay.value = _.get(foreCastInfo.value, ['forecastData', 'current', 'is_day'], 1) === 1; //isDay 1:白天 0:黑夜
    }
};

window.addEventListener('resize', () => {
    judgeCardType();
});
</script>

<style scoped lang="scss"></style>
