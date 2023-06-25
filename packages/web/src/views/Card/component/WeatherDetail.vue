<template>
    <div class="weather-detail">
        <div class="item" v-for="(item, index) in itemData" :key="index">
            <div class="left">
                <img :src="item.imgSrc" alt="" />
                <span>{{ item.describe }}</span>
            </div>
            <div class="right">
                {{ item.value }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import _ from 'lodash';
import { useWeatherStore } from '@/store/weather';
import { formatTimeUtils, kmToMs, WIND_DIR_MAPPING ,judgeUv ,judgeAirQuality} from '@/utils/tools';
import moment from 'moment';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
import i18n from '@/i18n/index';
import { useEtcStore } from '@/store/etc';

import FeelsLike from '@/assets/img/feelslike.png';
import SunRise from '@/assets/img/sunrise.png';
import SunSet from '@/assets/img/sunset.png';
import PressureMb from '@/assets/img/pressure_mb.png';
import WindKph from '@/assets/img/wind_kph.png';
import PrecipMm from '@/assets/img/precip_mm.png';
import WindDir from '@/assets/img/wind_dir.png';
import AirQuality from '@/assets/img/air_quality.png';
import Uv from '@/assets/img/uv.png';
import Avg_vis_km from '@/assets/img/avgvis_km.png';

const weatherStore = useWeatherStore();
const etcStore = useEtcStore();

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
}>();

/** 是否是摄氏度 */
const isCelsius = computed(() => weatherStore.weatherInfo.weather.tempUnit === 'C');

/** 仅取自己所需要的详情数据 */
interface IWeatherDetail {
    /** 摄氏体感温度 */
    feelslike_c: number;
    /** 华氏体感温度 */
    feelslike_f: number;
    /** 日出 */
    sunrise: string;
    /** 日落 */
    sunset: string;
    /** 气压 */
    pressure_mb: number;
    /** 风速 */
    wind_kph: number; //目前单位千米每小时
    /** 降雨量 */
    precip_mm: number; //单位mm毫米
    /** 风向 */
    wind_dir: string; //W N E
    /** 空气质量 */
    air_quality: number; //所有空气数据
    /** 紫外线 */
    uv: number;
    /** 能见度 */
    avgvis_km: number;
}

/** 展示的每行数据 */
interface IItemData {
    /** 图标 */
    imgSrc: string;
    /** 天气对应数值 */
    value: string | number;
    /** 天气 */
    describe: string;
}

onMounted(() => {
    initialAssignment();
});

const itemData = ref<IItemData[]>([]);

const isZhCn = computed(() => etcStore.language === 'zh-cn');

/** 初始化赋值 */
const initialAssignment = () => {
    let formState: IWeatherDetail = {
        feelslike_c: _.get(props.foreCastInfo, ['forecastData', 'current', 'feelslike_c'], 0),
        feelslike_f: _.get(props.foreCastInfo, ['forecastData', 'current', 'feelslike_f'], 0),
        sunrise: _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], [])[0].astro.sunrise,
        sunset: _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], [])[0].astro.sunset,
        pressure_mb: _.get(props.foreCastInfo, ['forecastData', 'current', 'pressure_mb'], 0),
        wind_kph: _.get(props.foreCastInfo, ['forecastData', 'current', 'wind_kph'], 0),
        precip_mm: _.get(props.foreCastInfo, ['forecastData', 'current', 'precip_mm'], 0),
        wind_dir: _.get(props.foreCastInfo, ['forecastData', 'current', 'wind_dir'], ''),
        air_quality: _.get(props.foreCastInfo, ['forecastData', 'current', 'air_quality', 'us-epa-index'], ''), //欧洲标准是gb-defra-index
        uv: _.get(props.foreCastInfo, ['forecastData', 'current', 'uv'], 0),
        avgvis_km: _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], [])[0].day.avgvis_km,
    };

    itemData.value = [
        { imgSrc: FeelsLike, value: (isCelsius.value ? formState.feelslike_c : formState.feelslike_f) + '°', describe: i18n.global.t('FEELS_LIKE') },
        { imgSrc: SunRise, value: formState.sunrise, describe: i18n.global.t('SUNRISE') },
        { imgSrc: SunSet, value: formState.sunset, describe: i18n.global.t('SUNSET') },
        { imgSrc: PressureMb, value: formState.pressure_mb + ' hPa', describe: i18n.global.t('PRESSURE_MB') },
        { imgSrc: WindKph, value: kmToMs(formState.wind_kph) + 'm/s', describe: i18n.global.t('WIND_KPH') },
        { imgSrc: PrecipMm, value: formState.precip_mm + ' mm', describe: i18n.global.t('PRE_CIP_MM') },
        { imgSrc: WindDir, value: WIND_DIR_MAPPING[formState.wind_dir], describe: i18n.global.t('WIND_DIR') },
        { imgSrc: AirQuality, value: judgeAirQuality(formState.air_quality), describe: i18n.global.t('AIR_QUALITY') },
        { imgSrc: Uv, value: formState.uv + judgeUv(formState.uv), describe: i18n.global.t('UV') },
        { imgSrc: Avg_vis_km, value: formState.avgvis_km+'km', describe: i18n.global.t('AVG_VIS_KM') },
    ];
};
</script>

<style scoped lang="scss">
.weather-detail {
    margin: 0 auto;
    user-select: none;
    width: 100%;
    // height: 427px;
    border: 1px solid #ccc;
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px;
    padding: 12px;
    margin-top: 12px;
    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffff;
        font-size: 16px;
        margin-bottom: 12px;
        font-weight: 500;
        img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
        }
    }
}
</style>
