<template>
    <div class="hour-forecast">
        <div class="header">
            <img src="@/assets/img/alarm.png" alt="" />
            <span>{{ $t('HOUR_FORECAST') }}</span>
        </div>
        <div class="card">
            <div class="item" v-for="(item, index) in HourData" :key="index">
                <p>{{ index === 0 ? $t('NOW') : formatTimeUtils(item.time_epoch, 'HH:mm') }}</p>
                <img :src="imgMapping(item)" alt="" />
                <p>{{ ( isCelsius ? item.temp_c : item.temp_f ) + '°' }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import _ from 'lodash';
import { useWeatherStore } from '@/store/weather';
import { formatTimeUtils, FORECAST_SETTING_MAPPING } from '@/utils/tools';
import moment from 'moment';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
import i18n from '@/i18n/index';
const weatherStore = useWeatherStore();

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay:boolean
}>();

/** 是否是摄氏度 */
const isCelsius = computed(() => weatherStore.weatherInfo.weather.tempUnit === 'C');

/** 天气小时数据 */
const HourData = ref<IHourData[]>([]);

/** 仅取自己所需要的小时数据 */
interface IHourData {
    condition: {
        /** 天气对应图码 */
        code: number;
        /** 当前天气 */
        text: string;
    };
    /** 当前小时摄氏度 */
    temp_c: string;
    /** 当前小时华氏度 */
    temp_f: string;
    /** 小时时间戳 */
    time_epoch: number;
}

onMounted(() => {
    assembleData();
});

/** 组装小时数据 */
const assembleData = () => {
    const forecastday = _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], []);
    if (forecastday.length > 0) {
        //考虑到当天例如23：00之后四小时时间,目前总共获取两天共48小时的数据;
        const twoDaysHourData: IHourData[] = _.concat(forecastday[0].hour, forecastday[1].hour);
        if (twoDaysHourData.length > 0) {
            let index = 0; //当前小时
            for (let i = 0; i <= twoDaysHourData.length - 1; i++) {
                if (twoDaysHourData[i].time_epoch <= moment().unix() && twoDaysHourData[i + 1].time_epoch >= moment().unix()) {
                    index = i;
                    break;
                }
            }
            //获取五小时的天气数据
            HourData.value = _.slice(twoDaysHourData, index, index + 5);
        }
    }
};

const imgMapping = (hourData:IHourData) =>{
    const item = FORECAST_SETTING_MAPPING.find((item)=>item.code ===hourData.condition.code );
    if(item) return props.isDay ? item.dayIcon : item.nightIcon;
    return '';
}
</script>

<style scoped lang="scss">
.hour-forecast {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    margin: 0 auto;
    user-select: none;
    width: 100%;
    height: 129px;
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px;
    padding: 12px;
    margin-top: 12px;
    .header {
        margin-bottom: 12px;
        img {
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }
        span {
            font-size: 12px;
            font-weight: 400;
            color: #ffff;
        }
    }
    .card {
        display: flex;
        width: 100%;
        justify-content: space-between;
        flex-direction: row;
        text-align: center;
        font-size: 10px;
        color: #ffffff;
        .item {
            img {
                width: 37px;
                height: 37px;
            }
        }
    }
}
</style>
