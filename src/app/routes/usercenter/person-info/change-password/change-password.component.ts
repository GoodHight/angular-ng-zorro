import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {
  loading = false;
  passwordForm: FormGroup;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private msg: NzMessageService
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]]
    });
  }
  /**
   * 确定修改密码
   */
  ok() {
    this.msg.success('密码修改成功！');
    this.router.navigate(['/usercenter/personInfo']);
  }
  /**
   * 取消修改密码
   */
  cancel() {
    this.router.navigate(['/usercenter/personInfo']);
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.passwordForm.controls['newPassword'].value) {
      return { confirm: true, error: true };
    }
  }
}
