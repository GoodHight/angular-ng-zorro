import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {GlobalState} from '../../../../service/global.state';

@Component({
    selector: 'app-set-index',
    templateUrl: './set-index.component.html',
})
export class SetIndexComponent implements OnInit {
    form: FormGroup;
    public isVisibleMiddle = false;
    public q: any = {
        pageNum: 1,
        pageSize: 20,
        order: 'desc',
        orderBy: '',
    };
    public positionList = [{childrenDictionaries: []},  {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}, {childrenDictionaries: []}];
    public url = environment.HRM_URL + 'service';
    public FRAMEWORK_URL = environment.FRAMEWORK_URL + 'service';
    public loading = false;
    public key = '';
    public dataList: any [];
    public addDataList = {
        account: '',
        bindEmail: '',
        guid: '',
        channelName: '',
        channelId: '',
        passWord: '',
        loginEid: this.token.get().loginEid,
        loginUid: this.token.get().userGuid,
    };

    constructor(private http: HttpClient, public msg: NzMessageService, private router: Router, @Inject(DA_SERVICE_TOKEN) private token: ITokenService, private fb: FormBuilder,
                private globalState: GlobalState) {

        this.globalState.subscribe('ADD_ACCOUNT', (success) => {
            this.isVisibleMiddle = true;
        });
    }

    /*
    * 获取列表数据
    * */
    public getData() {
        this.pageChange(1).then(() => {
            this.loading = true;
            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
            this.http.get(this.url + '/binding/account-index/', {params: this.q})
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.dataList = res.data;
                        this.loading = false;
                    }
                    if (res.code === 0) {
                        this.msg.error('没有数据');
                        this.loading = false;
                    }
                }, response => {
                    // console.log('服务器错误');
                    return;
                });
        });
    }

    /*
    * 详情
    * */
    details(guid: any) {
        this.router.navigate(['/recruit/resume/details', guid]);
    }

    /*
    * 一系列操作
    * */
    public patchResume(type: any) {

    }

    /*
    * 获取渠道Name
    * */
    public getQudaoName() {
        const channelId = this.addDataList.channelId;
        for (let i = 0; i < this.positionList[16]['childrenDictionaries'].length; i++) {
            if (this.positionList[16]['childrenDictionaries'][i]['guid'] === channelId) {
                this.addDataList.channelName = this.positionList[16]['childrenDictionaries'][i]['dictName'];
            }
        }
    }

    /*
    * 操作
    * */
    public handle(type: any, guid: any) {
        if (type !== 1) {
            this.http.put(this.url + '/binding/account/' + guid, null)
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.msg.success('操作成功');
                        this.getData();
                    } else {
                        this.msg.error(res.message);
                    }
                });
        } else {
            this.http.delete(this.url + '/binding/account/' + guid)
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.msg.success('操作成功');
                        this.getData();
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }
    }

    public pageChange(pi: number): Promise<any> {
        this.q.pageNum = pi;
        this.loading = true;
        return new Promise((resolve) => {
            setTimeout(() => {
                this.loading = false;
                resolve();
            }, 500);
        });
    }

    /*
    * 弹框
    * */
    showModalMiddle(resumeId: any): void {
        this.isVisibleMiddle = true;
    }

    /*
  * 获取下拉框数据
  * */
    private getSelectData() {

        this.http.get(this.FRAMEWORK_URL + '/dictionary/all')
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.positionList = res.data;
                }
                if (res.code === 0) {
                    this.positionList = [];
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    handleOkMiddle(): void {
        this.isVisibleMiddle = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        this.http.patch(this.url + '/binding/account', this.addDataList, {
            headers: headers,
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.getData();
                this.msg.success('添加成功');
                this.isVisibleMiddle = false;
            } else {
                this.msg.error(res.message);
            }
        });
    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;
    }

    ngOnInit() {
        // this.globalState.notifyDataChanged('toolbar', true);
        this.getData();
        this.getSelectData();
        this.form = this.fb.group({
            channelId: ['', [Validators.required]],
            account: ['', [Validators.required]],
            passWord: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

}
