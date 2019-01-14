

import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-version-add-edit',
    templateUrl: 'version-add-edit.component.html'
})

export class VersionAddEditComponent implements OnInit {

    httpUrl = environment.FRAMEWORK_URL + 'service/version';
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
            versionName: [null, [Validators.required]],
            versionNameTag: [null, [Validators.required]],
            versionNumber: [null, [Validators.required]],
            isConfig: [null, [Validators.required]]
        });
    }

    ngOnInit() { 
        // this.setForm(null);
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
            versionName: data['versionName'],
            versionNameTag: data['versionNameTag'],
            versionNumber: data['versionNumber'],
            isConfig: data['isConfig'] + ''
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
                    this.router.navigate(['/admin/version']);
                } else {
                    this.nzMsg.error(res.message);
                }
            });
        } else {
            this.http.patch(this.httpUrl + '/' + this.data.guid, this.form.value).subscribe((res: any) => {
                if (res.code === 1) {
                    this.nzMsg.success('修改成功！');
                    this.router.navigate(['/admin/version']);
                } else {
                    this.nzMsg.error(res.message);
                }
            });
        }
    }
}
