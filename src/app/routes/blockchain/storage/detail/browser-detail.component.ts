import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-browser-detail',
    templateUrl: 'browser-detail.component.html'
})

export class BrowserDetailComponent implements OnInit {
    
    httpUrl = environment.SERVER_URL + environment.HRM_URL + 'api/school/temp-certificate';

    loading = false;

    data = {
        preHash: '',
        witnessFirst: '',
        witnessFirstTime: '',
        witnessLast: '',
        witnessLastTime: '',
        depositDescription: '',
        height: '',
        dataHash: '',
        attachmentHash: ''
    };


    constructor(
        private activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private msg: NzMessageService
    ) { }

    ngOnInit() { 
        this.getDetail();
    }

    getDetail() {
        this.http.get(this.httpUrl + '/' + this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
            if (res.code === 1) {
                this.data = res.data;
            } else {
                this.msg.error(res.message);
            }
        });
    }

}
