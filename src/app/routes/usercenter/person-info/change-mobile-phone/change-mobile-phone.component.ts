import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { _Validators } from '@delon/util';

@Component({
  selector: 'app-change-mobile-phone',
  templateUrl: './change-mobile-phone.component.html',
  styleUrls: ['./change-mobile-phone.component.less']
})
export class ChangeMobilePhoneComponent implements OnInit {

  loading = false;
  step = 0;
  step1Form: FormGroup;
  step2Form: FormGroup;
  // 验证码重新获取时间
  codeTime = 60;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.step1Form = this.fb.group({
      oldMobilePhone: [null, [Validators.required, _Validators.mobile]],
      code: [null, Validators.required]
    });
    this.step2Form = this.fb.group({
      newMobilePhone: [null, [Validators.required, _Validators.mobile]],
      code: [null, Validators.required]
    });

  }
  timer;
  getCode() {
    // 调用获取验证码接口
    this.codeTime --;
    this.timer = setInterval(() => {
      this.codeTime --;
      if (this.codeTime === 0) {
        clearInterval(this.timer);
        this.codeTime = 60;
      }
    }, 1000);
  }
  /**
   * 下一步
   */
  next() {
    clearInterval(this.timer);
    this.codeTime = 60;
    this.step ++;
  }
  /**
   * 确定
   */
  confirm() {
    this.msg.success('修改成功');
    this.router.navigate(['/usercenter/personInfo']);
  }
  /**
   * 取消
   */
  cancel() {
    this.router.navigate(['/usercenter/personInfo']);
  }
}
