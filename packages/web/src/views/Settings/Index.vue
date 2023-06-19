<template>
    <div class="setting">
        <section>
            <h2 class="foreCast-setting">{{ $t('FORECAST_SETTING') }}</h2>
            <h3 class="forecast-describe">{{ $t('FORECAST_DESCRIBE') }}</h3>
            <div class="form">
                <a-form :model="formState" v-bind="layout" name="nest-messages" :validate-messages="validateMessages">
                    <a-form-item :name="['weather', 'weatherApiKey']" label="weatherApiKey" :rules="[{ required: true }]">
                        <a-input v-model:value="formState.weather.weatherApiKey" :placeholder="$t('PLEASE_ENTER_API_KEY')" />
                    </a-form-item>
                    <a-form-item :name="['weather', 'cityName']" label="cityName" :rules="[{ required: true }]">
                        <a-select
                            v-model:value="formState.weather.cityName"
                            show-search
                            :placeholder="$t('PLEASE_ENTER_CITY')"
                            style="width: 350px"
                            :default-active-first-option="false"
                            :filter-option="false"
                            :not-found-content="null"
                            :disabled="!formState.weather.weatherApiKey.trim()"
                            @search="(value:string)=>toggleDebounce(value)"
                        >
                            <a-select-option :key="select.id" :value="select.id" v-for="select in cityData">
                                {{ select.display_name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :name="['weather', 'tempUnit']" label="tempUnit" :rules="[{ required: true }]">
                        <a-select v-model:value="formState.weather.tempUnit" style="width: 350px" :placeholder="$t('PLEASE_ENTER_TEMPERATURE')">
                            <a-select-option :key="select.label" :value="select.value" v-for="select in temperatureData">
                                {{ select.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </div>
        </section>
        <footer class="footer">
            <a-button :disabled="disabled" type="primary" @click="submit">Submit</a-button>
        </footer>

        <iframe src="http://127.0.0.1:5173/#/card" class="scroll-bar" style="width: 170px;height: 170px;border:1px solid #ccc;"/>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
import { useWeatherStore } from '@/store/weather';
import { message } from 'ant-design-vue';
import { temperatureData } from '@/utils/tools';
import type { ICityData, IFormState } from '@/api/ts/interface/IWeatherInfo';
const weatherStore = useWeatherStore();
const router = useRouter();
onMounted(()=>{
    getSaveDate();
})

/** 表单数据 */
const formState = reactive<IFormState>({
    weather: {
        weatherApiKey: 'da6d2169b711424dac184721231206',
        cityName: undefined,
        tempUnit: undefined,
    },
});

/** 获取已经保存的数据 */
const getSaveDate = async() =>{
    const res = await api.GetSaveData();
    console.log('resData============>',res);
}

/** form表单的长度 */
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

/** 必填校验 */
const validateMessages = { required: '${label} is required!' };

/** 设置配置信息  */
const submit =async  () => {
    // console.log('------------->formState', formState);
    // console.log('------------->WeatherInfo', weatherStore.weatherInfo);
    const res = await api.setConfigData(formState.weather);
    if(res.error === 0 && res.data){
        console.log(res);
        weatherStore.setWeatherInfo(JSON.stringify(formState.weather));
    }
};

/** 控制提交按钮是否可以点击 */
const disabled = computed(() => {
    const weatherInfo = JSON.stringify(formState.weather);
    if (!formState.weather.weatherApiKey || !formState.weather.cityName || !formState.weather.tempUnit) {
        return true;
    }
    if (weatherStore.weatherInfo !== weatherInfo) {
        return false;
    } else {
        return true;
    }
});

//城市数据
const cityData = ref<ICityData[]>([]);

/** 获取城市数据 */
const getCityList = async (value: string) => {
    if (!value || !formState.weather.weatherApiKey) return;
    const res = await api.GetCityList(formState.weather.weatherApiKey.trim(), value);
    if (res.error === 0 && res.data) {
        cityData.value = res.data?.cityList.map((item) => {
            item.display_name = `${item.name} ( ${item.country} , ${item.region} )`;
            return item;
        });
    }else{
        cityData.value = [];
    }
};

/** 搜索城市防抖 */
const toggleDebounce = _.debounce(getCityList, 800, {
    leading: true,
    trailing: true,
});
</script>

<style scoped lang="scss">
.setting {
    padding: 18px;
    margin: 0 auto;
    // width:100%;
    .title {
        font-size: 16px;
        font-weight: 600;
    }
    .foreCast-setting {
        text-align: center;
    }
    .forecast-describe {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .form {
        width: 600px;
        margin: 0 auto;
        .ant-input {
            width: 350px;
        }
    }
    .footer {
        text-align: right;
        margin-top: 100px;
        :deep(.ant-btn) {
            border-radius: 8px 8px 8px 8px;
            border: 1px solid rgba(153, 153, 153, 0.3);
        }
    }
}
</style>
