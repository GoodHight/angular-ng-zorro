import { SettingsService } from '@delon/theme';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SocialService, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Md5 } from 'ts-md5';
import { MenuService } from '@delon/theme';
import { LOGGER_SERVICE_PROVIDER_FACTORY } from 'ng-zorro-antd/src/core/util/logger/logger.service';

@Component({
    selector: 'passport-login',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less'],
    providers: [SocialService]
})
export class IndexComponent implements OnInit {

    public message: any;
    public validateForm: FormGroup;
    public error = '';
    private type = 0;
    public loading = false;
    public messageState = '';
    public captcha = '';
    private count = 0;
    public userName = '';
    private interval$: any;
    userPasswordss = '';
    finaluserPassword = '';
    private _url = environment.SERVER_URL + environment.COMMONS_URL + 'service/captcha?captchaCodeId=';
    public url;
    public personal_log_url = environment.PERSONAL_LOGIN_HREF;
    value: any[];

    constructor(private http: HttpClient,
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public msg: NzMessageService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private menuService: MenuService) {
        this.activatedRoute.params.subscribe((params) => {
            const relogin = params['type'];
            console.log('relogin', relogin);
            if (relogin) {
                this.msg.error('会话过期，请重新登录');
            }
          });
    }

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0) {
                clearInterval(this.interval$);
            }
        }, 1000);
    }

    public getCaptchaCode() {
        const num = Math.random();
        const getCook = this.tokenService.get().captchaCodeId;
        this.url = '';
        if (!getCook) {
            const captchaCodeId = Md5.hashStr(num.toString()).toString().substr(16, 16);
            this.url = this._url + captchaCodeId;
            this.tokenService.set({
                token: '',
                'captchaCodeId': captchaCodeId
            });
        } else {
            this.url = this._url + getCook + '&_=' + num;
        }
    }

    captchaCode() {
        this.messageState = 'error';
        if (this.captcha.length === 4) {
            const captchaCodeId = this.tokenService.get().captchaCodeId;
            const captUrl = environment.SERVER_URL + environment.COMMONS_URL + 'service/captcha/validateCaptcha?captchaCode=' + this.validateForm.controls.captcha.value + '&captchaCodeId=' + captchaCodeId;
            // const headers = new HttpHeaders().set('CAPTCHA_CODE_ID', captchaCodeId);
            this.http.post(captUrl, {}).subscribe((res: any) => {
                if (res.code === 0) {
                    this.messageState = 'success';
                    // this.message = res.message;
                } else {
                    this.messageState = 'error';
                    this.message = res.message;
                }

            });
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    // endregion
    submitForm() {
        this.error = '';
        this.userPasswordss = '';
        this.finaluserPassword = '';
        const urlHref = environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/enterprise/login';
        const captchaCodeId = this.tokenService.get().captchaCodeId;
        this.loading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // const yonghuming = this.validateForm.controls.userName.value;
        const userPassword = this.validateForm.controls.password.value;
        this.userPasswordss = this.userPasswordss + Md5.hashStr(userPassword);
        let sb = '125639751@qq.com';
        for (let i = 0, length = this.userPasswordss.length / 2; i < length; i++) {
            sb = sb + this.userPasswordss.charAt(i * 2 + 1);
            sb = sb + this.userPasswordss.charAt(i * 2);
        }
        this.finaluserPassword = this.finaluserPassword + Md5.hashStr(sb);

        const body = new HttpParams()
            .set('userName', this.validateForm.controls.userName.value)
            .set('password', this.finaluserPassword)
            .set('captchaCodeId', captchaCodeId)
            .set('oauth2-client-id', 'OAUTH2_CLIENT_TEST')
            .set('oauth2-client-secret', 'ADMIN_TEST')
            .set('captchaCode', this.validateForm.controls.captcha.value);
        this.http.post(urlHref, body, { headers: headers })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.loading = false;
                    // 清空路由复用信息
                    this.tokenService.clear();
                    const currentMenus = [];
                    for (const i of res.data.data.menus) {
                        const menu = {};
                        menu['text'] = i.name;
                        menu['i18n'] = '';
                        menu['link'] = i.href;
                        menu['icon'] = i.icon;
                        if (i.subMenus.length > 0) {
                            menu['children'] = [];
                            for (const subItem of i.subMenus) {
                                const subMenu = {};
                                subMenu['text'] = subItem.name;
                                subMenu['i18n'] = '';
                                subMenu['link'] = subItem.href;
                                subMenu['icon'] = subItem.icon;
                                menu['children'].push(subMenu);
                            }
                        }
                        currentMenus.push(menu);
                    }
                    const completeMenu = [{
                        'text': '工作台',
                        'i18n': 'main_navigation',
                        'group': true,
                        'children': currentMenus
                    }];
                    if (res.data.type === 1) {
                        this.tokenService.set({
                            token: res.data.data.token,
                            account: res.data.data.account,
                            address: res.data.data.address,
                            areasId: res.data.data.areasId,
                            checkFlag: res.data.data.checkFlag,
                            checkTime: res.data.data.checkTime,
                            cityId: res.data.data.cityId,
                            createTime: res.data.data.createTime,
                            creator: res.data.data.creator,
                            delFlag: res.data.data.delFlag,
                            email: res.data.data.email,
                            enterpriseCode: res.data.data.enterpriseCode,
                            frozenFlag: res.data.data.frozenFlag,
                            frozenTime: res.data.data.frozenTime,
                            submitTime: res.data.data.submitTime,
                            guid: res.data.data.guid,
                            industryId: res.data.data.industryId,
                            industryNextId: res.data.data.industryNextId,
                            introduce: res.data.data.introduce,
                            modifier: res.data.data.modifier,
                            modifyTime: res.data.data.modifyTime,
                            name: res.data.data.name,
                            phone: res.data.data.phone,
                            provinceId: res.data.data.provinceId,
                            remark: res.data.data.remark,
                            scale: res.data.data.scale,
                            website: res.data.data.website,
                            type: res.data.type,
                            completeMenu: completeMenu
                        });
                    } else {
                        this.tokenService.set({
                            token: res.data.data.loginInfo.token,
                            account: res.data.data.loginInfo.phone,
                            name: res.data.data.loginInfo.name,
                            guid: res.data.data.loginInfo.enterpriseGuid, // 企业ID
                            userId: res.data.data.loginInfo.guid, // 用户id
                            employeeGuid: res.data.data.loginInfo.employeeGuid, // 员工id
                            type: res.data.type,
                            completeMenu: completeMenu
                        });
                        localStorage.setItem('userInfo', JSON.stringify(res.data.data.loginInfo));
                        // 处理目录菜单

                    }
                    this.menuService.add(completeMenu);
                    this.menuService.resume();
                    this.router.navigate(['/']);
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                    this.getCaptchaCode();
                }
            }, response => {
                this.msg.error('账户或密码错误');
                return;
            });


    }

    captchaValidator = (control: FormControl): any => {
        if (!this.messageState) {
            return { expired: true, error: true };
        }
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            userName: [null, [Validators.required, Validators.pattern(/(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/)]],
            password: [null, [Validators.required, Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
        setTimeout(() => {
            this.getCaptchaCode();
        }, 500);
    }
}

