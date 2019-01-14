import { Injectable, Injector } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd';
import * as df_en from 'date-fns/locale/en';
import * as df_zh_cn from 'date-fns/locale/zh_cn';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, AlainI18NService } from '@delon/theme';

@Injectable()
export class I18NService implements AlainI18NService {
    private _default = 'zh-CN';
    private change$ = new BehaviorSubject<string>(null);

    private _langs = [
        { code: 'en', text: 'English' },
        { code: 'zh-CN', text: '中文' },
    ];

    constructor(
        settings: SettingsService,
        private nzI18nService: NzI18nService,
        private translate: TranslateService,
        private injector: Injector,
    ) {
        /**
         * 此处对国际化进行了改动，
         * translate.getBrowserLang()内部获取的语言是'zh-CN'，但是内部把'zh-CN'截取为了'zh'，返回值最终为'zh'，
         * 这将影响到后续语言的设置，所以这里在当defaultLan为'zh'时，转换成'zh-CN'
         */
        let defaultLan = settings.layout.lang || translate.getBrowserLang();
        if (defaultLan === 'zh') {
            defaultLan = 'zh-CN';
        }
        const lans = this._langs.map(item => item.code);
        this._default = lans.includes(defaultLan) ? defaultLan : lans[0];
        
        translate.addLangs(lans);
        this.setZorro(this._default).setDateFns(this._default);
    }

    setZorro(lang: string): this {
        this.nzI18nService.setLocale(lang === 'en' ? en_US : zh_CN);
        return this;
    }

    setDateFns(lang: string): this {
        (window as any).__locale__ = lang === 'en' ? df_en : df_zh_cn;
        return this;
    }

    get change(): Observable<string> {
        return this.change$.asObservable().pipe(filter(w => w != null));
    }

    use(lang: string): void {
        lang = lang || this.translate.getDefaultLang();
        if (this.currentLang === lang) return;
        this.setZorro(lang).setDateFns(lang);
        this.translate.use(lang).subscribe(() => this.change$.next(lang));
    }
    /** 获取语言列表 */
    getLangs() {
        return this._langs;
    }
    /** 翻译 */
    fanyi(key: string) {
        return this.translate.instant(key);
    }
    /** 默认语言 */
    get defaultLang() {
        return this._default;
    }
    /** 当前语言 */
    get currentLang() {
        return (
            this.translate.currentLang ||
            this.translate.getDefaultLang() ||
            this._default
        );
    }
}
