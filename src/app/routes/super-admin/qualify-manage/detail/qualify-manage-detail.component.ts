import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

@Component({
    selector: 'app-detail',
    templateUrl: './qualify-manage-detail.component.html',
    styleUrls: [
        './qualify-manage-detail.component.less'
    ]
})
export class QualifyManageDetailComponent implements OnInit {


    dataDetail;
    url = environment.FRAMEWORK_URL + 'service/enterprise';
    guid;
    // 模态框
    isVisible = false;
    isOkLoading = false;
    changeForm: FormGroup;
    constructor(
        private http2: HttpClient,
        public msg: NzMessageService,
        private router: Router,
        private routes: ActivatedRoute,
        private fb: FormBuilder
    ) { 
        this.routes.params.subscribe((params) => {
            this.guid = params['guid'];
        });
        
    }

    ngOnInit() {
        
        this.getDetail(this.guid);
        this.changeForm = this.fb.group({
            oldPassword: [null, [Validators.required]],
            newPassword: [null, [Validators.required]],
            checkPassword: [null, [Validators.required, this.confirmationValidator]]
        });
    }
    
    /**
     * 改变密码
     */
    changePsw() {
        this.isVisible = true;
        this.isOkLoading = false;
        this.changeForm = this.fb.group({
            oldPassword: [null, [Validators.required]],
            newPassword: [null, [Validators.required]],
            checkPassword: [null, [Validators.required, this.confirmationValidator]]
        });
    }
    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.changeForm.controls['newPassword'].value) {
            return { confirm: true, error: true };
        }
    }
    handleCancel() {
        this.isVisible = false;
    }
    handleOk() {
        this.isOkLoading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams()
            .set('oldPassword', this.changeForm.value.oldPassword)
            .set('newPassword', this.changeForm.value.newPassword);
        this.http2.patch(this.url + '/modify-password/' + this.guid, body, {
            headers: headers
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('修改成功');
            } else {
                this.msg.error('修改失败');
            }
            this.isOkLoading = false;
        });
        this.isVisible = false;
    }
    getDetail(guid: string) {
        this.http2.get(this.url + '/' + guid).subscribe((res: any) => {
            if (res.code === 1) {
                this.dataDetail = res.data;
                // console.log(this.dataDetail);
                // this.loading = false;
            }
            if (res.code === 0) {
                this.msg.error('没有数据');
                // this.loading = false;
            }
        });

    }

    back() {
        this.router.navigate(['/admin/qualify/index']);
    }

}
