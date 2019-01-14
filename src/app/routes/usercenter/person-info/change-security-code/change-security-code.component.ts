import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-security-code',
  templateUrl: './change-security-code.component.html',
  styleUrls: ['./change-security-code.component.less']
})
export class ChangeSecurityCodeComponent implements OnInit {
  httpUrl = environment.FRAMEWORK_URL + 'service/user';
  loading = false;
  currentUser;
  userPhone;
  step1Form: FormGroup;
  step2Form: FormGroup;

  step = 0;
  // 验证码重新获取时间
  codeTime = 60;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) { }

  ngOnInit() {
    this.userPhone = this.tokenService.get().userPhone;
    this.step1Form = this.fb.group({
      code: [null, [Validators.required]]
    });
    this.step2Form = this.fb.group({
      newPassword: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]]
    });
  }

  // getCurrentUserInfo() {
  //   this.http.get(this.httpUrl + '/' + this.tokenService.get().userGuid).subscribe((res: any) => {
  //     if (res.code === 1) {
  //       this.currentUser = res;
  //     }
  //   });
  // }

  getCode() {
    // 调用获取验证码接口
    this.codeTime--;
    const timer = setInterval(() => {
      this.codeTime--;
      if (this.codeTime === 0) {
        clearInterval(timer);
        this.codeTime = 60;
      }
    }, 1000);
  }
  next() {
    // 验证验证码
    this.step++;
  }

  cancel() {
    this.router.navigate(['/usercenter/personInfo']);
  }

  confirm() {
    this.msg.success('安全码修改成功！');
    this.router.navigate(['/usercenter/personInfo']);
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.step2Form.controls['newPassword'].value) {
      return { confirm: true, error: true };
    }
  }
}
