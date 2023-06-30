<template>
    <div class="test-icon">
        说明：测试程序，测完删除<br/>
        1、初始化进入显示与详情code码对应的 白天图标-夜晚天气描述  夜晚图标-夜晚天气描述;<br/>
        2、输入2显示所有图标;<br/>
        3、输入对应code码显示对应图标和天气描述;<br/>
        4、语言跟随ihost;<br/>
        <a-input v-model:value="inputVal" @change="inputChange" />
        <div class="card">
            <div class="item" v-for="i in arrList">
                <img :src="FORECAST_SETTING_MAPPING[i].dayIcon" alt="" />
                <span class="day">{{ i18n.global.t(FORECAST_SETTING_MAPPING[i].day)}}</span>
                <img :src="FORECAST_SETTING_MAPPING[i].nightIcon" alt="" />
                <span class="night">{{i18n.global.t(FORECAST_SETTING_MAPPING[i].night)}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import i18n from '@/i18n/index';
import { ref, onMounted, } from 'vue';
import _ from 'lodash';
import { FORECAST_SETTING_MAPPING, translateByCode } from '@/utils/tools';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
}>();
const inputVal = ref();
const arrList = ref<any[]>([]);
onMounted(() => {
    const code = _.get(props.foreCastInfo, ['forecastData', 'current', 'condition', 'code'], 1000);
    arrList.value.push(code);
});

const init = () =>{
    arrList.value = [];
    for (const item in FORECAST_SETTING_MAPPING) {
        arrList.value.push(item);
    }
}

const inputChange = () =>{
    if(inputVal.value == 2){
        init();
        return;
    }
    arrList.value = [];
    let flag = false;
    for(const item in FORECAST_SETTING_MAPPING){
        if(item == inputVal.value){
            flag = true;
        }
    }
    if(!flag)return;

    if(inputVal.value)
    arrList.value.push(inputVal.value);
}
</script>

<style scoped lang="scss">
.test-icon {
    width: 100%;
    height: 100%;
    margin-top: 50px;
    color:#ffff;
    .card{
        font-size: 16px;
        color:#ffff;
        img{
            width: 36px;
            height: 36px;
        }
    }
}
</style>
