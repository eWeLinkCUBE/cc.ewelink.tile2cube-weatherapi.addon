<template>
    <div class="cast-card">
        <!--  :style="{ width: formState.cardWidth + 'px' }" -->
        <header>
            <div class="area-icon">
                <img src="@/assets/img/area.png" alt="" />
                <span>{{ formState.cityName }}</span>
            </div>
        </header>
        <section>
            <div class="temperature">
                <img src="@/assets/img/sunny.png" alt="" />
                <span>{{ formState.temperature + '°'}}</span>
            </div>
            <div class="weather">
                <span class="word">
                    {{ formState.describe }}
                </span>
                <div class="api">
                    <img alt="" src="@/assets/img/area.png" />
                    <span>weather<br />api</span>
                </div>
            </div>
        </section>
        <div class="update-time">{{ $t('UPDATE') + ':' + formState.updateTime }}</div>
    </div>
 </template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import i18n from '@/i18n/index';
import _ from 'lodash';
import type { IForeCastResultInfo, ICardStyle } from '@/api/ts/interface/IWeatherInfo';
import { useWeatherStore } from '@/store/weather';
import { formatTimeUtils } from '@/utils/tools';
const weatherStore = useWeatherStore();

const props = defineProps<{
    styleObject: ICardStyle;
    foreCastInfo: IForeCastResultInfo;
}>();

onMounted(() => {
    init();
});

const init = () =>{
    //页面宽度
    formState.cardWidth = props.styleObject.width;
    //城市名称
    formState.cityName = _.get(props.foreCastInfo, ['forecastData', 'location', 'name'], '');
    //根据缓存取对应单位的温度
    const tempUnit = weatherStore.weatherInfo.weather.tempUnit === 'C' ? 'temp_c' : 'temp_f';
    formState.temperature = _.get(props.foreCastInfo, ['forecastData', 'current', tempUnit], '');
    //天气更新时间
    const time = _.get(props.foreCastInfo, ['forecastData', 'current', 'last_updated_epoch'], 0);
    formState.updateTime = formatTimeUtils(time, 'HH:mm');
    //当前天气
    formState.describe = _.get(props.foreCastInfo, ['forecastData', 'current', 'condition', 'text'], '');
}

interface ISmallCardData {
    /** 城市名称 */
    cityName: string;
    /** 温度 */
    temperature: number;
    /** 天气描述 */
    describe: string;
    /** 更新时间 */
    updateTime?: number | string;
    /** 组件宽度 */
    cardWidth: number;
}

/** 1*1卡片所需的数据 */
const formState = reactive<ISmallCardData>({
    cityName: '',
    temperature: 0,
    describe: '',
    updateTime: 0,
    cardWidth: 0,
});

window.addEventListener('resize', () => {
    console.log('处理窗口缩放时要处理的逻辑操作！');
});
</script>

<style scoped lang="scss">
.cast-card {
    margin: 0 auto;
    text-align: center;
    padding: .5rem;
    border-radius: .375rem;
    width:100%;
    min-height: 100vh;
    header {
        display: flex;
        align-items: center;
        text-align: left;
        .area-icon {
            img {
                width: .875rem;
                height: .875rem;
                margin-right: .375rem;
            }
            span {
                font-size: .75rem;
            }
        }
    }
    section {
        margin-top: .5rem;
        .temperature {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
                width: 3.25rem;
                height: 3.25rem;
            }
            span {
                color: #333333;
                font-size: 1.75rem;
            }
        }
        .weather {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: .625rem;
            .word {
                display: inline-block;
                white-space: nowrap;
                width: 3.25rem;
                text-align: center;
                color: #333333;
                font-size: 1rem;
            }
            .api {
                display: flex;
                justify-content: space-between;
                align-items: center;
                img {
                    width: .75rem;
                    height: .9375rem;
                    margin-right: .3125rem;
                }
                span {
                    font-size: .75rem;
                    color: #333333;
                    text-align: right;
                    line-height: .6875rem;
                }
            }
        }
    }
    .update-time {
        text-align: left;
        margin-top: .9375rem;
        font-size: .875rem;
        color: #333333;
    }
}
@media screen and (min-width: 200px) {
    .cast-card {
    }
}
</style>
