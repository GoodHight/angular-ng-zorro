import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {NzMessageService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {GlobalState} from '../../../service/global.state';

@Component({
    selector: 'app-set',
    templateUrl: './set.component.html',
})
export class SetComponent implements OnInit {
    isVisibleMiddle = false;
    public toolbar = true;
    public tabSelectIndex = 0;
    tabs = [{
        key: '/recruit/set/index',
        tab: '账号绑定',
    }, {
        key: '/recruit/set/email',
        tab: '邮箱绑定',
    }];


    constructor(private http: HttpClient, public msg: NzMessageService, private router: Router, @Inject(DA_SERVICE_TOKEN) private token: ITokenService, private fb: FormBuilder, private globalState: GlobalState) {
        this.globalState.subscribe('ADD_ACCOUNT', (success) => {
            this.toolbar = success;
        });

    }

    /*
* 弹框
* */
    showModalMiddle(resumeId: any): void {
        // this.isVisibleMiddle = true;
        this.toolbar = false;
        this.globalState.notifyDataChanged('ADD_ACCOUNT', true);
    }

    to(item: any) {
        this.router.navigateByUrl(`${item.key}`).then();
    }

    ngOnInit() {
        this.to(this.tabs[this.tabSelectIndex]);

    }

    OnDestroy() {
        this.globalState.removeSubscribe('toolbar');
    }

}
