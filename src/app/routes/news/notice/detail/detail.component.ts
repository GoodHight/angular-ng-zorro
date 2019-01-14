import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { GlobalState } from '../../../../service/global.state';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-notice-detail',
    styleUrls: ['./detail.component.less'],
    templateUrl: './detail.component.html',
})

export class NoticeDetailComponent {
    public uuid = ''; // 编辑状态下传递UUID号
    public content = '';
    public title = '';
    public messageTime = '';
    public readCount = 0;
    public notReadCount = 0;
    noticeFiles = [];
    constructor(private router: Router, private activateRoute: ActivatedRoute, private http: HttpClient,
        public msg: NzMessageService, private globalState: GlobalState) {
        this.activateRoute.params.subscribe((params) => {
            this.uuid = params['uuid'];
        });
        this.getData(); 
    }
    imgSrc = ''; 
    OnInit() {
        this.getData();
        this.http.get(environment.FRAMEWORK_URL + 'service/message/read-count/' + this.uuid).subscribe((res: any) => {
            if (res.code === 1) {
                this.readCount = res.data.isReadCount;
            } else {
                this.msg.error(res.message);
            }
        }, response => {

        });
        alert(1123132);
    }

    OnDestroy() {

    }
    public getData() {
        this.http.get(environment.NOTICE_URL + 'service/notice/' + this.uuid).subscribe((res: any) => {
            if (res.code === 0) {
                this.content = res.data.content;
                this.title = res.data.title;
                this.messageTime = res.data.createTime;
                this.readCount = res.data.readCount;
                this.notReadCount = res.data.notReadCount;
                this.noticeFiles = res.data.noticeFiles;
                if (res.data.noticeCover !== '') {
                    this.imgSrc = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + res.data.noticeCover;
                } else {
                    this.imgSrc = '';
                }
            } else {
                this.msg.error(res.message);
            }
        }, response => {

        });
    }
    public back() {
        this.router.navigate(['/news/notice']);
    }

    /* 
    下载附件
    */
    down(fileId) {
        location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + fileId;
    }
}
