import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.less']
})
export class SignatureComponent implements OnInit {

    httpUrl = environment.HRM_URL + 'service/signature';
    tabSelectIndex = 0;
    // 签章列表
    signatureList = [];
    // 加载等待
    loading = false;
    tabs: any[] = [{
        key: '',
        tab: '我的签章',
    }];


    constructor(
        private http: HttpClient,
        private modalService: NzModalService,
        private message: NzMessageService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getSignatureList();
    }

    getSignatureList() {
        this.loading = true;
        this.http.get(this.httpUrl).subscribe((res: any) => {
            if (res.code === 1) {
                this.signatureList = res.data;
            } else {
                if (!res.data) {
                    this.signatureList = [];
                }
            }
            this.loading = false;
        }, (err) => {
            this.loading = false;
        });
    }
    /**
     * 设置默认模版
     * @param item 
     */
    setDefaultSignature(item) {
        this.loading = true;
        this.http.post(this.httpUrl + '/default/' + item.guid, {}).subscribe((res: any) => {
            if (res.code === 1) {
                this.message.success('设置默认模板成功！');
            }
            this.getSignatureList();
        }, (err) => {
            this.message.error('设置默认模板失败！');
            this.loading = false;
        });
    }
    /**
     * 删除模板
     * @param item 
     */
    deleteSignature(item) {
        this.modalService.confirm({
            nzTitle: '删除',
            nzContent: '是否删除该电子章？',
            nzOkText: '确定',
            nzOnOk: () => {
                this._delete(item.guid);
            },
            nzCancelText: '取消',
            nzOnCancel: () => console.log('Cancel')
          });
    }

    _delete(id: any) {
        this.loading = true;
        this.http.delete(this.httpUrl + '/' + id).subscribe((res: any) => {
            if (res.code === 1) {
                this.message.success('删除成功！');
            }
            this.getSignatureList();
        }, (err) => {
            this.message.error('删除失败！');
            this.loading = false;
        });
    }
    gotoEdit(item) {
        this.router.navigate(['/usercenter/signature/index/edit/' + item.guid]);
    }
}
