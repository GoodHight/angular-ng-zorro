import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { Md5 } from 'ts-md5';
import { MenuService } from '@delon/theme';
import { stringify } from '@angular/core/src/util';

const USERDATA = {
    agree: true
};

@Component({
    selector: 'passport-register',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})

export class IndexComponent implements OnInit {

    validateForm: FormGroup;
    error = '';
    type = '0';
    id = '0';
    public captcha = '';
    disabled = false;
    loading = false;
    public messageState = '';
    message: any;
    status = 'pool';
    userPasswordss = '';
    finaluserPassword = '';
    public url = environment.SERVER_URL + environment.COMMONS_URL + 'service/captcha?captchaCodeId=';
    public personal_reg_url = environment.PERSONAL_REG_HREF;
    captchabtn = true;
    private smsUrl = environment.SERVER_URL;

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
            this.url = environment.SERVER_URL + environment.COMMONS_URL + 'service/captcha?captchaCodeId=' + getCook + '&' + num;
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

    getCaptchas() {
        if (!this.validateForm.controls.userName.value) {
            this.msg.error('请输入企业名称');
            return;
        }
        if (!this.validateForm.controls.email.value) {
            this.msg.error('请输入企业邮箱');
            return;
        }
        if (!this.validateForm.controls.captcha.value) {
            this.msg.error('请输入图形验证码');
            return;
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        if (this.validateForm.controls.email.value && this.validateForm.controls.email.value !== '') {
            this._http.post(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/enterprise/validateUserName?userName=' + this.validateForm.controls.email.value, {}, { headers: headers })
                .subscribe((res: any) => {
                    if (res.code === 0) {
                        this.disabled = false;
                        this.msg.error('邮箱已注册');
                    } else {
                        this.disabled = false;
                        this.getCaptcha();
                    }
                });
        }
    }

    getCaptcha() {
        if (this.validateForm.controls.email.value && this.validateForm.controls.email.value !== '') {
            this.disabled = true;
            this.count = 59;
            this.interval$ = setInterval(() => {
                this.count -= 1;
                if (this.count <= 0) {
                  clearInterval(this.interval$);
                  this.disabled = false;
                }
            }, 1000);
            this.smsUrl = '/email/service/mail/validCaptcha/0?email=' + this.validateForm.controls.email.value + '&captchaCode=' + this.validateForm.controls.captcha.value + '&captchaCodeId=' + this.tokenService.get().captchaCodeId;
            this._http.post(this.smsUrl, {})
                .subscribe((res: any) => {
                    if (res.code === 0) {

                    } else {
                        this.count = 1;
                        this.disabled = false;
                        this.msg.error(res.message);
                        this.getCaptchaCode();
                    }

                });
        } else {
            this.msg.error('请输入企业账号');
        }
    }

    public getCaptchaCode() {
        const num = Math.random();
        const getCook = this.tokenService.get().captchaCodeId;
        if (!getCook) {
            const captchaCodeId = Md5.hashStr(num.toString()).toString().substr(16, 16);
            this.url = environment.SERVER_URL + environment.COMMONS_URL + 'service/captcha?captchaCodeId=' + captchaCodeId;
            this.tokenService.set({
                token: this.tokenService.get().token,
                captchaCodeId: captchaCodeId,
            });
        } else {
            this.url = environment.SERVER_URL + environment.COMMONS_URL + 'service/captcha?captchaCodeId=' + getCook + '&' + num;
        }
    }

    public captchaCode() {
        this.messageState = 'error';
        if (this.captcha.length === 4) {
            const captchaCodeId = this.tokenService.get().captchaCodeId;
            const captUrl = environment.SERVER_URL + environment.COMMONS_URL + 'service/captcha/validateCaptcha?captchaCode=' + this.validateForm.controls.captcha.value + '&captchaCodeId=' + captchaCodeId;
            // const headers = new HttpHeaders().set('CAPTCHA_CODE_ID', captchaCodeId);
            this._http.post(captUrl, null, {
                withCredentials: true
            }).subscribe((res: any) => {
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
        this.userPasswordss = '';
        this.finaluserPassword = '';
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
            // return;
        }
        if (!this.validateForm.controls.userName.value) {
            this.msg.error('请输入企业名称');
            return;
        }
        if (!this.validateForm.controls.email.value) {
            this.msg.error('请输入企业邮箱');
            return;
        }
        if (!this.validateForm.controls.captcha.value) {
            this.msg.error('请输入图形验证码');
            return;
        }
        if (!this.validateForm.controls.smsCode.value) {
            this.msg.error('请输入动态验证码');
            return;
        }
        if (!this.validateForm.controls.password.value) {
            this.msg.error('请输入登录密码');
            return;
        }
        if (!this.validateForm.controls.agree.value) {
            this.msg.error('请勾选用户协议');
            return;
        }

        const userName = this.validateForm.controls.email.value;
        const urlHref = environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/enterprise/register';
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // const yonghuming = this.validateForm.controls.email.value;
        const userPassword = this.validateForm.controls.password.value;
        this.userPasswordss = this.userPasswordss + Md5.hashStr(userPassword);
        // console.log(this.userPasswordss);

        let sb = '125639751@qq.com';
        for (let i = 0, length = this.userPasswordss.length / 2; i < length; i++) {
            sb = sb + this.userPasswordss.charAt(i * 2 + 1);
            sb = sb + this.userPasswordss.charAt(i * 2);
        }
        this.finaluserPassword = this.finaluserPassword + Md5.hashStr(sb);
        // console.log('第二次' +  this.finaluserPassword);
        const body = new HttpParams()
            .set('userName', userName)
            .set('enterpriseName', this.validateForm.controls.userName.value)
            .set('userPassword', this.finaluserPassword)
            .set('captchaCodeId', this.tokenService.get().captchaCodeId)
            .set('captchaCode', this.validateForm.controls.captcha.value)
            .set('checkCode', this.validateForm.controls.smsCode.value);
        this._http.post(urlHref, body, { headers: headers })
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
        // console.log(this.id);
        this.validateForm = this.fb.group({
            userName: [null, [Validators.required]], // 企业名称
            email: [null, [Validators.email]], // 邮箱账号
            password: [null, [Validators.required, Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)]],
            captcha: [null, [Validators.required]],
            smsCode: [null, [Validators.required]],
            agree: [true, [Validators.required]]
        });
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }

}
