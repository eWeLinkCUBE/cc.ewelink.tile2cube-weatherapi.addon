<template>
    <!-- 2*1 card and card multiplexing in details -->
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
import { formatTimeUtils, getWeekByTimeStamp, isEmptyObject, getQuery, FORECAST_SETTING_MAPPING ,translateByCode } from '@/utils/tools';
import moment from 'moment';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
const weatherStore = useWeatherStore();

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay: boolean;
    tempUnit: boolean;
}>();

/** 2*1 data required by the card */
interface ILargeCardData {
    /** city name */
    cityName: string;
    /** weather describe */
    describe: string;
    /** temperature */
    temperature: number;
    /** weather update time */
    updateTime?: number | string;
    /** Weather data for the next four days */
    forecastday: IForeCastDay[];
    /** Pictures of the current weather */
    imgSrc: string;
}

interface IForeCastDay {
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
}

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

onMounted(() => {
    getPageData();
});

watch(
    () => [props.foreCastInfo,props.tempUnit,props.isDay],
    () => {
        getPageData();
    }
);

/** Determine whether the current card is 2*1 or in the details */
const isDetailCard = ref(false);

/** get page params */
const getPageData = () => {
    //city name
    formState.cityName = _.get(props.foreCastInfo, ['forecastData', 'location', 'name'], '');
    //Get the temperature of the corresponding unit according to the interface
    const tempUnit = props.tempUnit ? 'temp_c' : 'temp_f';
    formState.temperature = _.get(props.foreCastInfo, ['forecastData', 'current', tempUnit], '');
    // weather update time
    const time = _.get(props.foreCastInfo, ['forecastData', 'current', 'last_updated'], 0);
    formState.updateTime = time.split(' ')[1]; //formatTimeUtils((new Date(time).getTime()), 'HH:mm');
    //current weather code
    const code = _.get(props.foreCastInfo, ['forecastData', 'current', 'condition', 'code'], 1000);
    // const item = FORECAST_SETTING_MAPPING[code];
    formState.describe =translateByCode(code,props.isDay);
    formState.imgSrc = props.isDay ? FORECAST_SETTING_MAPPING[code].dayIcon : FORECAST_SETTING_MAPPING[code].nightIcon;
    //foreCast
    formState.forecastday = _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], []);
    //If it is less than five days, use the default map to complete five days;
    try {
        if (formState.forecastday && formState.forecastday.length === 3) {
            for (let i = 0; i < 2; i++) {
                const item: IForeCastDay = {
                    astro: {},date: '',date_epoch: formState.forecastday[2].date_epoch + 86400 * (i + 1),
                    day: {maxtemp_c: '',mintemp_c: '',mintemp_f: '',maxtemp_f: '',condition: {code: 0,text: '',icon: ''}},
                    hour: [],
                };
                formState.forecastday.push(item);
            }
            console.log('formState.forecastday--------->', formState.forecastday);
        }
    } catch (error) {
        console.log(error);
    }

    //Remove the weather of the day
    formState.forecastday = formState.forecastday.filter((i, d) => d !== 0);

    judgeCardType();
};

/** Determine whether it is a 2*1 card or a details drawer card */
const judgeCardType = () => {
    const params = getQuery(window.location.href);
    if (params.ihost_env === 'iHostWebCustomCardDrawer') {
        isDetailCard.value = true;
    } else {
        isDetailCard.value = false;
    }
};

/** Get the minimum and maximum temperature of the corresponding unit */
const getMiniMaxTempByList = (days: IDays) => {
    if (isEmptyObject(days)) return '';
    // Display when completion is less than five days old
    if (!days.mintemp_c && !days.mintemp_f) {
        return '--';
    }
    // Judgment temperature unit
    if (props.tempUnit) {
        return days.mintemp_c + '-' + days.maxtemp_c + '°';
    } else {
        return days.mintemp_f + '-' + days.maxtemp_f + '°';
    }
};

/** map picture */
const imgMapping = (days: IDays) => {
    const item = FORECAST_SETTING_MAPPING[days.condition.code];
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
