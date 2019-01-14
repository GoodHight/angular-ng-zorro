

import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-tr-add-edit',
    templateUrl: 'tr-add-edit.component.html'
})

export class TrAddEditComponent implements OnInit {
    httpUrl = environment.HRM_URL + 'service/hrm-role-tag';
    // 编辑时获取对象
    data;
    // 编辑时传过来的guid
    guid;
    /**
     * 表单验证对象
     */
    form: FormGroup;

    constructor(
        private http: HttpClient,
        private nzMsg: NzMessageService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router
    ) { 
        this.form = this.fb.group({
            dataScope: [null],
            isConfig: [null, [Validators.required]],
            roleName: [null, [Validators.required]],
            roleScope: [null, [Validators.required]]
        });
    }

    ngOnInit() { 
        if (!this.activatedRoute.routeConfig.path.includes('add')) {
            this.guid = this.activatedRoute.snapshot.paramMap.get('guid');
            this.getEditData();
        }
    }
    /**
     * 设置表单对象form
     * @param data 
     */
    setForm (data) {
        this.form.setValue({
            dataScope: data['dataScope'],
            isConfig: data['isConfig'] + '' || '0',
            roleName: data['roleName'],
            roleScope: data['roleScope']
        });
    }

    /**
     * 得到编辑时的对象数据
     */
    getEditData() {
        this.http.get(this.httpUrl + '/' + this.guid).subscribe((res: any) => {
            if (res.code === 1) {
                this.data = res.data;
                this.setForm(this.data);
            } else {
                this.nzMsg.error(res.message);
            }
        });
    }
    /**
     * 保存
     */
    save() {
        if (!this.guid) {
            this.http.post(this.httpUrl, this.form.value).subscribe((res: any) => {
                if (res.code === 1) {
                    this.nzMsg.success('新增成功！');
                    this.router.navigate(['/admin/templaterole']);
                } else {
                    this.nzMsg.error(res.message);
                }
            });
        } else {
            this.http.patch(this.httpUrl + '/' + this.data.guid, this.form.value).subscribe((res: any) => {
                if (res.code === 1) {
                    this.nzMsg.success('修改成功！');
                    this.router.navigate(['/admin/templaterole']);
                } else {
                    this.nzMsg.error(res.message);
                }
            });
        }
    }
}
