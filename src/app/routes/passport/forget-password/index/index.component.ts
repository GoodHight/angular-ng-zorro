import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { Md5 } from 'ts-md5';
import { MenuService } from '@delon/theme';
@Component({
    selector: 'app-forget-password',
    styleUrls: ['./index.component.less'],
    templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {

    validateForm: FormGroup;
    error = '';
    type = '0';
    id = '0';
    disabled = false;
    loading = false;
    message: any;
    status = 'pool';
    userPasswordss = '';
    finaluserPassword = '';
    public url = environment.SERVER_URL + environment.COMMONS_URL + 'service/captcha?captchaCodeId=';
    private smsUrl = environment.SERVER_URL + '/oauth2/';
    private loginUrl = environment.ENTERPRISE_URL;

    constructor(private fb: FormBuilder, private route: ActivatedRoute, public msg: NzMessageService, private router: Router,
        private _http: HttpClient, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private menuService: MenuService) {

        const num = Math.floor(Math.random() * 100 + 1);
        const getCook = tokenService.get().captchaCodeId;
        if (!getCook) {
            const captchaCodeId = Md5.hashStr(num.toString()).toString().substr(16, 16);
            this.tokenService.set({
                token: this.tokenService.get().token,
                captchaCodeId: captchaCodeId
            });
        } else {
            this.url = this.url + getCook + '&' + num;
        }
    }

    static checkPassword(control: FormControl) {
        if (!control) return null;
        const self: any = this;
        self.visible = !!control.value;
        if (control.value && control.value.length > 9)
            self.status = 'ok';
        else if (control.value && control.value.length > 5)
            self.status = 'pass';
        else
            self.status = 'pool';

        if (self.visible) self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }

    static passwordEquar(control: FormControl) {
        if (!control || !control.parent) return null;
        if (control.value !== control.parent.get('password').value) {
            return { equar: true };
        }
        return null;
    }


    count = 0;
    interval$: any;

    getCaptcha() {
        this._http.post('/email/' + 'service/mail/1?email=' + this.validateForm.controls.userName.value, {})
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.disabled = true;
                    this.count = 59;
                    this.interval$ = setInterval(() => {
                        this.count -= 1;
                        if (this.count <= 0)
                            clearInterval(this.interval$);
                        this.disabled = false;
                    }, 1000);
                } else {
                    this.msg.error(res.message);
                }

            });

    }

    public getCaptchaCode() {
        const num = Math.random();
        const getCook = this.tokenService.get().captchaCodeId;
        if (!getCook) {
            const captchaCodeId = Md5.hashStr(num.toString()).toString().substr(16, 16);
            this.url = this.url + captchaCodeId;
            this.tokenService.set({
                token: this.tokenService.get().token,
                captchaCodeId: captchaCodeId,
            });
        } else {
            this.url = this.url + getCook + '&' + num;
        }
    }

    public captchaCode() {
        // this.message = false;
        // const captchaCodeId = this.tokenService.get().captchaCodeId;
        // const captUrl = this.capUrl + '?captchaCode=' + this.validateForm.controls.captcha.value + '&captchaCodeId=' + captchaCodeId;
        // // const headers = new HttpHeaders().set('CAPTCHA_CODE_ID', captchaCodeId);
        // this._http.post(captUrl, null, {
        //     withCredentials: true
        // }).subscribe((res: any) => {
        //     if (res.code !== 1) {
        //         this.message = false;
        //     }
        // });
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    // endregion

    _submitForm() { 
        this.userPasswordss = '';
        this.finaluserPassword = '';
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
        const urlHref = this.loginUrl + 'service/enterprise/modifyPassword';
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // const yhname = this.validateForm.controls.userName.value;
        const userPassword = this.validateForm.controls.userPassword.value;
        this.userPasswordss = this.userPasswordss + Md5.hashStr(userPassword);
        let sb = '125639751@qq.com';
        for (let i = 0, length = this.userPasswordss.length / 2; i < length; i++) {
            sb = sb + this.userPasswordss.charAt(i * 2 + 1);
            sb = sb + this.userPasswordss.charAt(i * 2);
        }
        this.finaluserPassword = this.finaluserPassword + Md5.hashStr(sb);
        const body = new HttpParams()
            .set('userName', this.validateForm.controls.userName.value)
            .set('userPassword', this.finaluserPassword)
            .set('captchaCodeId', this.tokenService.get().captchaCodeId)
            .set('captchaCode', this.validateForm.controls.captchaCode.value)
            .set('checkCode', this.validateForm.controls.checkCode.value);
        this._http.patch(urlHref, body, { headers: headers })
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
            });
    }

    login() {
        this.router.navigate(['/passport/login']);
    }

    ngOnInit(): void {
        this.route.params
            .subscribe((params: Params) => {
                return this.id = params['id'];
            });
        this.validateForm = this.fb.group({
            userName: [null, [Validators.required, Validators.pattern(/(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/)]],
            userPassword: [null, [Validators.required, Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)]],
            captchaCode: [null, [Validators.required]],
            checkCode: [null, [Validators.required]],
            agree: [true],
        });
    }
}
