<template>
    <!-- 2*1卡片和详情内卡片复用  :style="{ width: formState.cardWidth + 'px' }"-->
    <div class="Large-card" :class="isDetailCard ? 'isDetail-card' : ''">
        <header v-if="!isDetailCard">
            <div class="area-icon">
                <img src="@/assets/img/area.png" alt="" />
                <span>{{ formState.cityName }}</span>
            </div>
            <div class="weather-api">
                <img src="@/assets/img/weather-api.png" alt="" />
                <span>weather<br />api</span>
            </div>
        </header>
        <section class="section">
            <div class="left-area">
                <img :src="formState.imgSrc" alt="" />
                <div class="describe">
                    <p>{{ formState.describe }}</p>
                    <div v-if="!isDetailCard">{{ $t('UPDATE') + ':' + formState.updateTime }}</div>
                </div>
            </div>
            <div class="right-area">
                {{ formState.temperature + '°' }}
            </div>
        </section>
        <section class="forecast">
            <div class="card" v-for="(item, index) in formState.forecastday" :key="index">
                <p class="weekday">{{ $t(`weekday.${getWeekByTimeStamp(item.date_epoch)}`) }}</p>
                <img :src="imgMapping(item.day)" alt="" />
                <p class="temperatrue">{{ getMiniMaxTempByList(item.day) }}</p>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import i18n from '@/i18n/index';
import _ from 'lodash';
import { useWeatherStore } from '@/store/weather';
import { formatTimeUtils, getWeekByTimeStamp, isEmptyObject, getQuery, FORECAST_SETTING_MAPPING } from '@/utils/tools';
import moment from 'moment';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
const weatherStore = useWeatherStore();

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay:boolean
}>();

/** 2*1 卡片所需的数据 */
interface ILargeCardData {
    /** 城市名称 */
    cityName: string;
    /** 天气 */
    describe: string;
    /** 温度 */
    temperature: number;
    /** 更新时间 */
    updateTime?: number | string;
    /** 未来四天的天气数据 */
    forecastday: {
        /** 日出日落时间 */
        astro: object;
        /** 时间 */
        date: string;
        /** 时间戳 */
        date_epoch: number;
        /** 当天准确数据 */
        day: IDays;
        /** 精确时间数据 */
        hour: any[];
    }[];
    /** 当前天气的图片 */
    imgSrc: string;
}

/** 当前天气数据，仅仅写了自己需要,数据太多有需要自取 */
interface IDays {
    //最大摄氏度
    maxtemp_c: '';
    //最小摄氏度
    mintemp_c: '';
    //最小摄氏度
    mintemp_f: '';
    //最大华氏度
    maxtemp_f: '';
    /** 天气 */
    condition: {
        code: number;
        text: string;
        icon: string;
    };
}

const formState = reactive<ILargeCardData>({
    cityName: '',
    updateTime: 0,
    describe: '',
    temperature: 0,
    forecastday: [],
    imgSrc: '',
});

/** 是否是摄氏度 */
const isCelsius = computed(() => weatherStore.weatherInfo.weather.tempUnit === 'C');

onMounted(() => {
    getPageData();
});

/**判断当前是否是2*1卡片还是详情内 */
const isDetailCard = ref(false);

/** 获取页面参数 */
const getPageData = () => {
    //城市名
    formState.cityName = _.get(props.foreCastInfo, ['forecastData', 'location', 'name'], '');
    // //根据缓存取对应单位的温度
    const tempUnit = isCelsius.value ? 'temp_c' : 'temp_f';
    formState.temperature = _.get(props.foreCastInfo, ['forecastData', 'current', tempUnit], '');
    // //更新时间
    const time = _.get(props.foreCastInfo, ['forecastData', 'current', 'last_updated_epoch'], 0);
    formState.updateTime = formatTimeUtils(time, 'HH:mm');
    //当前天气
    const code = _.get(props.foreCastInfo, ['forecastData', 'current', 'condition', 'code'], 1000);
    for(const item of FORECAST_SETTING_MAPPING){
        if(item.code === code){
            formState.describe = props.isDay ? item.day :item.night;
            formState.imgSrc = props.isDay ? item.dayIcon:item.nightIcon;
        }
    }
    //未来天气预报
    formState.forecastday = _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], []);
    //去除当日天气
    formState.forecastday = formState.forecastday.filter((i, d) => d !== 0);

    judgeCardType();
};

/** 判断是2*1卡片还是详情抽屉卡片 */
const judgeCardType = () =>{
    const params = getQuery(window.location.href);
    if (params.ihost_env === 'iHostWebCustomCardDrawer') {
        isDetailCard.value = true;
    } else {
        isDetailCard.value = false;
    }
}

/** 获取对应单位的最低和最高温度 */
const getMiniMaxTempByList = (days: IDays) => {
    if (isEmptyObject(days)) return '';
    if (isCelsius.value) {
        return days.mintemp_c + '-' + days.maxtemp_c + '°';
    } else {
        return days.mintemp_f + '-' + days.maxtemp_f + '°';
    }
};

/** 映射图片 */
const imgMapping = (days: IDays) => {
    const item = FORECAST_SETTING_MAPPING.find((item) => item.code === days.condition.code);
    if (item) return props.isDay ? item.dayIcon : item.nightIcon;
    return '';
};
</script>

<style scoped lang="scss">
.Large-card {
    user-select: none;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    padding: 8px 12px 2px 12px;
    height: 100vh;
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        .area-icon {
            img {
                width: 14px;
                height: 14px;
                margin-right: 6px;
            }
            span {
                font-size: 12px;
            }
        }
        .weather-api {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
                width: 16px;
                height: 16px;
            }
            span {
                font-size: 12px;
                color: #333333;
                text-align: right;
                line-height: 11px;
            }
        }
    }
    .section {
        display: flex;
        justify-content: space-between;
        .left-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
                width: 52px;
                height: 52px;
                margin-right: 12px;
            }
            .describe {
                display: flex;
                align-items: center;
                flex-direction: column;
                text-align: left;
                p {
                    width: 100%;
                    color: #333333;
                    font-size: 16px;
                    font-weight: 600;
                }
                div {
                    width: 100%;
                    font-size: 14px;
                    font-weight: 400;
                    color: #333333;
                }
            }
        }
        .right-area {
            font-size: 32px;
            font-weight: 500;
            color: #333333;
        }
    }
    .forecast {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 7px;
        .card {
            text-align: center;
            font-weight: 500;
            .weekday {
                font-size: 10px;
                color: #333333;
            }
            img {
                width: 37px;
                height: 37px;
            }
            .temperatrue {
                font-size: 12px;
                color: #333333;
            }
        }
    }
}
.isDetail-card {
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px;
    opacity: 1;
    width: 100% !important;
    height: auto !important;
    padding-top: 18px;
    padding-bottom: 15px;
    .describe {
        p {
            color: #ffff !important;
        }
    }
    .right-area {
        color: #ffff !important;
    }
    .weekday,
    .temperatrue {
        color: #ffff !important;
    }
}
</style>
