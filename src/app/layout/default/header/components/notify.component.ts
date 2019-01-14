import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import { Component, OnInit, Inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

/**
 * 菜单通知
 */
@Component({
    selector: 'header-notify',
    template: `
    <notice-icon
    [count]="messagecount"
    [loading]="loading" 
    (click)="click()" style='color:red!important'></notice-icon>
    `
})
export class HeaderNotifyComponent implements OnInit {

    messagecount = 0;
    loading = false;

    constructor(private router: Router, private http: HttpClient,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        public msg: NzMessageService) { }
    // 接口字符串
    typeUrl = environment.SERVER_URL + environment.MESSAGE_URL;
    public paramsData: any = {
        pageNum: 1,
        pageSize: 20,
        userId: this.tokenService.get().guid,
    };
    // 定义的数组
    dataList: any;
    // 总的页数
    total: any;
    // 未读人数
    notReadcCount: any;
    // 获取数据
    getMessageData() {
        this.http.get(this.typeUrl + 'service/message/getListByUser', { params: this.paramsData })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    // console.log(res.data);
                    this.notReadcCount = res.data.notReadcCount;
                    this.messagecount = this.notReadcCount;
                }
            });
    }
    click() {
        this.messagecount = 0;
        this.router.navigate(['/message/list']);
    }
    ngOnInit() {
        this.getMessageData();
    }
}
