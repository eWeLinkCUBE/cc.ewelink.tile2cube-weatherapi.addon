<template>
    <div class="setting">
        <!-- <div>歌手翻唱山地车士大夫士大夫士大夫大师傅随风倒随风倒随风倒</div> -->
        <header>
            <span class="title" @click="router.push('/card');">{{ $t('SETTING') }}</span>
        </header>
        <section>
            <h2 class="foreCast-setting">{{ $t('FORECAST_SETTING') }}</h2>
            <h3 class="forecast-describe">{{ $t('FORECAST_DESCRIBE') }}</h3>
            <div class="form">
                <a-form :model="formState" v-bind="layout" name="nest-messages" :validate-messages="validateMessages">
                    <a-form-item :name="['weather', 'apiKey']" label="apiKey" :rules="[{ required: true }]">
                        <a-input v-model:value="formState.weather.apiKey" :placeholder="$t('PLEASE_ENTER_API_KEY')" @change="submitChange"/>
                    </a-form-item>
                    <a-form-item :name="['weather', 'city']" label="city" :rules="[{ required: true }]">
                        <a-select
                            v-model:value="formState.weather.city"
                            show-search
                            placeholder="Select a person"
                            style="width: 350px"
                            :options="cityData"
                            :filter-option="filterOption"
                            @focus="handleFocus"
                            @change="handleChange"
                        ></a-select>
                    </a-form-item>
                    <a-form-item :name="['weather', 'temperature']" label="temperature" :rules="[{ required: true }]">
                        <a-select v-model:value="formState.weather.temperature" style="width: 350px">
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
import {useWeatherStore} from '@/store/weather';
const weatherStore = useWeatherStore();
const router = useRouter();
interface IFormState{
    weather:{
        apiKey:string,
        city:string|undefined,
        temperature:string
    }
}
const formState = reactive<IFormState>({
    weather: {
        apiKey: '',
        city: undefined,
        temperature: '',
    },
});
//form表单的长度
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
//必填校验
const validateMessages = {required: '${label} is required!'};

const cityData = ref([
    { value: 'shenzhen', label: '深圳' },
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'hangzhou', label: '杭州' },
]);
const temperatureData = [
    {
        label: '℃',
        value: '℃',
    },
    {
        label: '℉',
        value: '℉',
    },
];
const handleFocus = () => {};
const handleChange = () => {};
const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const submit = () => {
    console.log('------------->formState',formState);
    console.log('------------->WeatherInfo',weatherStore.weatherInfo);
    weatherStore.setWeatherInfo(JSON.stringify(formState.weather));
};

const disabled = computed(()=>{
    const weatherInfo =JSON.stringify(formState.weather);
    if(!formState.weather.apiKey || !formState.weather.city || !formState.weather.temperature){
        return true;
    }
    if(weatherStore.weatherInfo !== weatherInfo){
        return false
    }else{
        return true;
    }
});

const submitChange = () =>{
}
</script>

<style scoped lang="scss">
.setting {
    padding: 18px;
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
    .footer{
        text-align: right;
        margin-top: 100px;
        :deep(.ant-btn) {
            border-radius: 8px 8px 8px 8px;
            border: 1px solid rgba(153, 153, 153, 0.3);
        }
    }
}
</style>
