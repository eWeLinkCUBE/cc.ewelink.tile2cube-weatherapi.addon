import { defineStore } from 'pinia';
import i18n from '@/i18n';
import api from '@/api';
interface IEtcState {
    language: 'zh-cn' | 'en-us';
    at: string;
}

export const useEtcStore = defineStore('addon_etc', {
    state: (): IEtcState => {
        return {
            /** 国际化语言 */
            language: 'zh-cn',
            /** 登录凭证 */
            at: '',
        };
    },
    getters: {},
    actions: {
        setAt(at: string) {
            this.at = at;
        },
        languageChange(language:'zh-cn' | 'en-us'){
            this.language = language;
            i18n.global.locale = language;
        }
    },
    persist: true,
});
