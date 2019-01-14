

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
    selector: 'app-sr-add',
    templateUrl: 'sr-add.component.html'
})
export class SrAddComponent implements OnInit {

    httpUrl = environment.FRAMEWORK_URL + 'service/sys-role';
    form: FormGroup;
    // 是否是新增
    isAdd = true;
    // 编辑guid
    editGuid = null;
    // 编辑对象
    editData = null;
    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private msg: NzMessageService,
        private activatedRoted: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.editGuid = this.activatedRoted.snapshot.paramMap.get('guid');
        if (!this.editGuid) {
            this.isAdd = true;
        } else {
            this.isAdd = false;
            this.getEditDetail(this.editGuid);
        }
        this.form = this.fb.group({
            isConfig: [null, [Validators.required]],
            isTemplate: [null, [Validators.required]],
            roleName: [null, [Validators.required]],
            roleScope: [null, [Validators.required]]
        });
    }

    getEditDetail(guid) {
        this.http.get(this.httpUrl + '/' + guid).subscribe((res: any) => {
            if (res.code === 1) {
                this.editData = res.data;
                this.form.setValue({
                    isConfig: this.editData.isConfig + '',
                    isTemplate: this.editData.isTemplate + '',
                    roleName: this.editData.roleName,
                    roleScope: this.editData.roleScope,
                });
            } else {
                this.msg.error(res.message);
            }
        });
    }

    submit() {
        if (this.isAdd) {
            this.http.post(this.httpUrl, this.form.value).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('新增成功！');
                    this.router.navigate(['sysfunc/sysrole/index']);
                } else {
                    this.msg.error(res.message);
                }
            });
        } else {
            this.http.patch(this.httpUrl + '/' + this.editGuid, this.form.value).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('修改成功！');
                    this.router.navigate(['sysfunc/sysrole/index']);
                } else {
                    this.msg.error(res.message);
                }
            });
        }
    }
}
