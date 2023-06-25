<template>
    <component :is="cardType" :styleObject="styleObject" :foreCastInfo="foreCastInfo" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import SmallCard from '@/views/Card/component/SmallCard.vue';
import LargeCard from '@/views/Card/component/LargeCard.vue';
import DetailCard from '@/views/Card/component/DetailCard.vue';
import CastCard from '@/views/Card/component/CastCard.vue';
import { getQuery } from '@/utils/tools';
import api from '@/api/Weather/index';
import type { IRequestForeCastInfo ,IForeCastResultInfo ,ICardStyle} from '@/api/ts/interface/IWeatherInfo'

/** 当前的卡片类型 */
const cardType = ref<any>();

/** 天气数据 */
const foreCastInfo = ref<IForeCastResultInfo>();

/** 样式参数 */
const styleObject = reactive<ICardStyle>({
    width: 0,
    height: 0,
});

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
    getIframeWidth();
    // await judgeCardType();

    // console.log('styleObject--------------->',window.innerWidth,window.innerHeight);
    await getForeCastInfo();
    cardType.value = DetailCard;
});

/** 获取iframe容器的宽高 */
const getIframeWidth = () => {
    styleObject.width = window.innerWidth;
    styleObject.height = window.innerHeight;
}

/** 判断当前卡片类型 */
const judgeCardType = async () =>{
    const params = getQuery(window.location.href);
    if (params.ihost_env) {
        await getForeCastInfo();
        cardType.value = relationMap[params.ihost_env];
        console.log('------------------>',params.ihost_env);
        //2*1卡片
        if (styleObject.width !== styleObject.height && params.ihost_env === 'iHostWebCustomCard') {
            cardType.value = relationMap['iHostWebCustomLargeCard'];
        }
    }
}

/** 获取天气预报信息 */
const getForeCastInfo = async () =>{
    const params: IRequestForeCastInfo = {
        refresh: '1',
        days: 5,
    };
    const res = await api.getForeCastInfo(params);
    foreCastInfo.value = res.data;
    console.log('foreCastInfo.value-------------->', foreCastInfo.value);
    console.log('styleObject-------------->',styleObject);
}
//todo: 屏幕尺寸变化的时候
</script>

<style scoped lang="scss"></style>
