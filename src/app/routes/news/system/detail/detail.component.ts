import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { GlobalState } from '../../../../service/global.state';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-system-detail',
    styleUrls: ['./detail.component.less'],
    templateUrl: './detail.component.html',
})

export class SystemDetailComponent {
    public uuid = ''; // 编辑状态下传递UUID号
    public content = '';
    public title = '';
    public readCount = 0;
    public messageTime = '';
    public notReadCount = 0;
    noticeFiles = [];
    imgSrc = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/';
    constructor(private router: Router, private activateRoute: ActivatedRoute, private http: HttpClient,
        public msg: NzMessageService, private globalState: GlobalState) {
        this.activateRoute.params.subscribe((params) => {
            this.uuid = params['uuid'];
        });
        this.getData();
    }

    OnInit() {
        // if (!isNullOrUndefined(this.uuid)) {
        //     this.http.get(environment.NOTICE_URL + 'service/message/' + this.uuid).subscribe((res: any) => {
        //         if (res.code === 1) {
        //             this.content = res.data.messageContent;
        //             this.title = res.data.messageTitle;
        //             this.messageTime = res.data.messageTime;
        //         } else {
        //             this.msg.error(res.message);
        //         }
        //     }, response => {

        //     });

        //     this.http.get(environment.NOTICE_URL + 'service/message/read-count/' + this.uuid).subscribe((res: any) => {
        //         if (res.code === 1) {
        //             this.readCount = res.data.isReadCount;
        //         } else {
        //             this.msg.error(res.message);
        //         }
        //     }, response => {

        //     });

        // }
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
        this.router.navigate(['/news/system']);
        this.globalState.notifyDataChanged('toolbar', true);
    }
    /* 
   下载附件
   */
    down(fileId) {
        location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + fileId;
    }

}
