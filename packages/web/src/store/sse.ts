import { defineStore } from 'pinia';
import { sseUrl } from '@/config';
import { useEtcStore } from './etc';
import { message } from 'ant-design-vue';
import i18n from '@/i18n';
import type {
    IGateWayInfoData,
} from '@/api/ts/interface/IWeatherInfo';
let source: null | EventSource = null;

interface ISseState {
    sseIsConnect: boolean;
}

export const useSseStore = defineStore('sse', {
    state: (): ISseState => {
        return {
            sseIsConnect: false,
        };
    },
    actions: {
        setSseIsConnect(state: boolean) {
            this.sseIsConnect = state;
        },

        async startSse() {
            console.log('start SSE');
            if (source) source.close();
            const timestamp = new Date().getTime();
            source = new EventSource(`${sseUrl}?id=${timestamp}`);
            source.addEventListener('open', () => {
                const etcStore = useEtcStore();
                console.log('SSE connect success');
                this.sseIsConnect = true;
            });

            /** SSE失败 */
            source.addEventListener('error', async (event: any) => {
                console.log('SSE connect error, reboot');
                await this.startSse();
            });
        },
    },
    persist: true,
});
