import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Md5 } from 'ts-md5';
import { Router } from '@angular/router';

@Component({
    selector: 'app-update-password',
    templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent implements OnInit {
    form: FormGroup;
    loading = false;
    private disabled = false;
    private smsUrl = environment.SERVER_URL + '/oauth2/';
    public url = environment.SERVER_URL + '/oauth2/captcha?captchaCodeId=';
    private loginUrl = environment.ENTERPRISE_URL;
    private userUrl = environment.USER_URL;
    selectValue;
    useroldPassword = '';
    oldPassword = '';
    usernewPassword = '';
    newPassword = '';
    urlHref = '';
    options = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'disabled', label: 'Disabled', disabled: true }
    ];
    count = 0;
    interval$: any;
    constructor(private fb: FormBuilder, private msg: NzMessageService, private _http: HttpClient,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private router: Router) {
        this.selectValue = this.options[0];
    }
    // 用户类型1 = 企业 0 = 个人
    public userType = this.tokenService.get().type;
    // _submitForm() {
    //     // tslint:disable-next-line:forin
    //     for (const i in this.form.controls) {
    //         this.form.controls[i].markAsDirty();
    //     }
    //     // console.log('log', this.form.value);
    //     if (this.form.valid) {
    //         // this.http.post('')
    //         this.msg.success('Successed!');
    //     } else {
    //         this.msg.error('Fail!');
    //     }
    // }

    _submitForm() {
        this.useroldPassword = '';
        this.oldPassword = '';
        this.urlHref = '';
        this.newPassword = '';
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.tokenService.get().type === 1) {
            this.urlHref = this.loginUrl + 'service/enterprise/updatePassword/' + this.tokenService.get().guid;
        } else {
            this.urlHref = this.userUrl + 'service/user/updatePassword/' + this.tokenService.get().userId;
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const eoldthm = this.tokenService.get().account;
        const useroldPassword = this.form.controls.oldPassword.value;
        this.useroldPassword = this.useroldPassword + Md5.hashStr(useroldPassword);
        let sb = '125639751@qq.com';
        for (let i = 0, length = this.useroldPassword.length / 2; i < length; i++) {
            sb = sb + this.useroldPassword.charAt(i * 2 + 1);
            sb = sb + this.useroldPassword.charAt(i * 2);
        }
        this.oldPassword = this.oldPassword + Md5.hashStr(sb);
        // const yonghuming = this.tokenService.get().account;
        const usernewPassword = this.form.controls.newPassword.value;
        this.usernewPassword = this.usernewPassword + Md5.hashStr(usernewPassword);
        let sm = '125639751@qq.com';
        for (let i = 0, length = this.usernewPassword.length / 2; i < length; i++) {
            sm = sm + this.usernewPassword.charAt(i * 2 + 1);
            sm = sm + this.usernewPassword.charAt(i * 2);
        }
        this.newPassword = this.newPassword + Md5.hashStr(sm);
        const body = new HttpParams()
            // .set('guid', this.tokenService.get().guid)
            .set('oldPassword', this.oldPassword)
            .set('newPassword', this.newPassword);
        this._http.patch(this.urlHref, body, { headers: headers })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('修改成功');
                    this.loading = false;
                    this.tokenService.clear();
                    this.router.navigateByUrl(this.tokenService.login_url);
                } else {
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }


    ngOnInit(): void {
        // 用户类型1 = 企业 0 = 个人
        this.userType = this.tokenService.get().type;
        this.form = this.fb.group({
            guid: [null],
            userName: [this.tokenService.get().account, [Validators.required]],
            oldPassword: [null, Validators.required],
            newPassword: [null, [Validators.required, Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)]]
        });
    }
    getFormControl(name) {
        return this.form.controls[name];
    }
    /*
    * 返回
    * */
    back() {
        this.router.navigate(['/']);
    }


}
