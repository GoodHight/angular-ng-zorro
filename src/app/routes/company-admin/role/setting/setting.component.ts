import {Component, Inject, OnInit} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
})
export class SettingComponent implements OnInit {

    public dataList = [];
    public dataLists: any[];
    public url = environment.HRM_URL + 'service';
    public guid: any;
    public editCache = [];
    public indeterminate = false;
    public publicData = {};

    constructor(private http: HttpClient, 
        private activatedRoute: ActivatedRoute, 
        private router: Router, 
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private msg: NzMessageService
    ) {

    }

    tabs: any[];

    /*
    * 获取当前角色的功能列表
    * */
    public getDataList() {
        this.http.get(this.url + '/hrm-virtual-user/get-auth/' + this.guid, {
            params: this.publicData
        })
        // this.http.get(this.url + '/hrm-menu')
            .subscribe((res: any) => {
                if (res.code === 1) {
                    res.data.forEach(data => {
                        this.dataList.push(data.guid);
                    });
                    this.getListDatas();
                }
            });
    }

    /*
    * 获取全部权限列表
    * */
    public getListDatas() {
        this.http.get(this.url + '/hrm-role/list')
            .subscribe((res: any) => {
                if (res.code === 1) {

                    res.data.forEach((datas, index) => {
                        if (this.dataList.includes(datas.guid)) {
                            datas.isDefault = true;
                            this.editCache.push(datas.guid);
                        } else {
                            datas.isDefault = false;
                        }
                    });
                    this.dataLists = res.data;
                }
            });

    }

    to(item: any) {
        this.router.navigateByUrl(`/admin/${item}`).then();
    }

    /*
    * 重组数据
    * */
    public refreshStatus() {

        this.dataLists.forEach((datas, index) => {
            if (this.dataList.includes(datas.guid)) {
                datas.isDefault = true;
                this.editCache.push(datas.guid);
            } else {
                datas.isDefault = false;
            }
        });
        // console.log(this.dataLists);
    }

    /*
    * 当前整行的全选
    * */
    checkAll(key: any, guid: any, value: boolean) {
        if (!value) {
            this.dataLists[key].isDefault = value;
            for (let i = 0; i < this.editCache.length; i++) {
                if (guid === this.editCache[i]) {
                    this.editCache.splice(i, 1);
                }
            }
        } else {
            this.editCache.push(guid);
            this.dataLists[key].isDefault = value;
        }

    }

    /*
    * 保存授权
    * */
    submit() {
        this.http.post(this.url + '/hrm-virtual-user/add-auth/' + this.guid, this.editCache, {
            params: this.publicData
        })
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('授权成功！');
                    this.router.navigate(['/companyadmin/user']);
                } else {
                    this.msg.error(res.message);
                }
            });
    }


    ngOnInit() {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                return this.guid = params['guid'];
            });
        this.tabs = [{
            key: 'role/setting/' + this.guid,
            tab: '分配权限',
        }];
        this.getDataList();
        
    }

}
