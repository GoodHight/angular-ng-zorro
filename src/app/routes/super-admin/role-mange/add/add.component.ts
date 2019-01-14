import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public form: FormGroup;
  public dataList: any[];
  public submitting = false;
  tabs: any[] = [{
    key: '',
    tab: '角色信息',
  }
  ];
  public guid = '';
  public type = '';

  public url = environment.ENTERPRISE_URL;

  constructor(private http: HttpClient, private fb: FormBuilder, public msg: NzMessageService, private router: Router, private activatedRoute: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        return this.guid = params['guid'];
      });
  }
  public formData = {
    enterpriseId: this.tokenService.get().guid,
    roleName: '',
    // roleCode: '',
    roleId: this.guid,
    name: ''
  };
  public thisUrl = this.url + 'service/role/addRole';

  /*
  * 提交
  * */
  public submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.valid) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const navUrl = '/admin/authority/role';
      if (this.guid !== '0') {
        this.formData.name = this.formData.roleName;
        this.http.post(environment.ENTERPRISE_URL + 'service/role/updateSysRole', {}, { params: this.formData }).subscribe((res: any) => {
          if (res.code === 0) {
            this.msg.success('修改成功');
            this.router.navigate([navUrl]).then();
          } else {
            this.msg.error(res.message);
          }
        });
      } else {
        this.http.post(this.thisUrl, {}, { params: this.formData })
          .subscribe((res: any) => {
            if (res.code === 0) {
              this.msg.success('新增成功');
              this.router.navigate([navUrl]).then();
            } else {
              this.msg.error(res.message);
            }
          });
      }
    }
  }

  /*
  * 编辑获取数据
  * */
  private getData() {
    if (this.guid !== '0') {
      this.http.get(environment.ENTERPRISE_URL + 'service/role/getRoleInfoByRoleId?roleId=' + this.guid)
        .subscribe((res: any) => {
          if (res.code === 0) {
            this.formData.roleName = res.data.name;
            // this.formData.roleCode = res.data.code;
            this.formData.roleId = res.data.guid;
          } else {
            this.msg.error(res.message);
          }
        });
    }
  }

  ngOnInit() {
    this.getData();
    this.form = this.fb.group({
      roleName: [this.formData.roleName, [Validators.required]],
      // roleCode: [this.formData.roleCode, [Validators.required]],
    });
  }
}
