import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@delon/theme';

@Component({
    selector: 'app-dashboard-v1',
    templateUrl: './v1.component.html',
    styleUrls: ['./v1.component.less']
})

export class DashboardV1Component implements OnInit {

    public shortcutMenus: any = [];
    public statistics = {
        birthday: '',
        date: '',
        entry: '',
        onJob: '',
        positive: '',
        quit: ''
    }; // 统计信息
    public state = this.settings.layout.collapsed;
    public newests: any = [];
    public isemptynew: Boolean = true;
    public isVisibleMiddle = false;
    checkVisible = false;
    yqtsmodal = false;
    public realName: string = null;
    private service: any;
    private guid: any;
    userID = '';
    type: any;
    showFlag: any;
    dataList = [];
    selectData = [];
    // public col:number=4;
    // private rows:number=1;
    constructor(private router: Router, private http: HttpClient, public msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) service: ITokenService, private settings: SettingsService) {
        this.guid = service.get().guid;
        this.service = service;
    }

    ngOnInit() {
        if (this.service.get().type === 1) {
            this.type = 1;
            this.userID = this.service.get().guid;
        } else {
            this.type = 2;
            this.userID = this.service.get().userId;
        }
        this.realName = this.service.get().name;
        this.loadTemplate();
        this.getStatistics();
    }

    private loadTemplate() {
        this.showFlag = 1;
        if (this.type === 1) {
            this.http.get(environment.ENTERPRISE_URL + 'service/hrmShortMenu/' + this.guid, {
                params: {
                    type: this.type,
                    showFlag: this.showFlag,
                }
            }).subscribe((res: any) => {
                if (res.code === 0) {
                    this.shortcutMenus = res.data;
                } else {
                    this.shortcutMenus = [];
                    this.msg.error('获取快捷菜单失败');
                }
            }, response => {
                this.shortcutMenus = [];
            });
        } else {
            this.http.get(environment.ENTERPRISE_URL + 'service/hrmShortMenu/' + this.guid, {
                params: {
                    userId: this.userID,
                    type: this.type,
                    showFlag: this.showFlag,
                }
            }).subscribe((res: any) => {
                if (res.code === 0) {
                    this.shortcutMenus = res.data;
                } else {
                    this.shortcutMenus = [];
                    this.msg.error('获取快捷菜单失败');
                }
            }, response => {
                this.shortcutMenus = [];
            });
        }
        // 新闻信息
        // this.http.get(environment.FRAMEWORK_URL + 'service/message/newest').subscribe((res: any) => {
        //     if (res.code === 0) {
        //         if (res.data && res.data.length > 0) {
        //             this.newests = res.data;
        //             this.isemptynew = false;
        //         } else {
        //             this.isemptynew = true;
        //         }
        //     } else {
        //         this.newests = [];
        //         this.isemptynew = true;
        //     }
        // }, response => {
        //     this.newests = [];
        //     this.isemptynew = true;
        // });
    }
    // 统计当月员工信息
    getStatistics() {
        this.http.get(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/employee/workbench/' + this.service.get().guid).subscribe((res: any) => {
            if (res.code === 0) {
                this.statistics = res.data;
            } else {
                this.statistics = {
                    birthday: '',
                    date: '',
                    entry: '',
                    onJob: '',
                    positive: '',
                    quit: ''
                };
                this.msg.error(res.message);
            }
        });
    }
    public updateMenu() {
        if (this.type === 1) {
            this.http.get(environment.ENTERPRISE_URL + 'service/hrmShortMenu/' + this.guid, {
                params: {
                    type: this.type,
                }
            }).subscribe((res: any) => {
                if (res.code === 0) {
                    this.dataList = res.data;
                    this.selectData = [];
                    this.dataList.forEach((value: any, key) => {
                        if (value.showFlag === 1) {
                            this.dataList[key].checked = true;
                            this.selectData.push(value.guid);
                        }
                    });
                } else {
                    this.msg.error(res.message);
                }
                this.loadTemplate();
                // this.isVisibleMiddle = false;
            });
        } else {
            this.http.get(environment.ENTERPRISE_URL + 'service/hrmShortMenu/' + this.guid, {
                params: {
                    userId: this.userID,
                    type: this.type,
                }
            }).subscribe((res: any) => {
                if (res.code === 0) {
                    this.dataList = res.data;
                    this.selectData = [];
                    this.dataList.forEach((value: any, key) => {
                        if (value.showFlag === 1) {
                            this.dataList[key].checked = true;
                            this.selectData.push(value.guid);
                        }
                    });
                } else {
                    this.msg.error(res.message);
                }
                this.loadTemplate();
                // this.isVisibleMiddle = false;
            });
        }
        this.isVisibleMiddle = true;
    }

    updateAllChecked(index): void {
        const getGuid = this.dataList[index].guid;
        if (this.selectData.length > 0) {
            if (this.isInArray3(this.selectData, getGuid)) {
                this.selectData.splice(this.selectData.indexOf(getGuid), 1);
            } else {
                this.selectData.push(getGuid);
            }
        } else {
            this.selectData.push(getGuid);
        }
    }
    yqtsmodalCancel() {
        this.yqtsmodal = false;
    }
    yqtsmodalOkMiddle() {
        this.yqtsmodal = false;
    }
    public navigation(item: any, checkFlag: any) {
        if (checkFlag === 0) {
            this.yqtsmodal = true;
        } else {
            if (item.target) {
                this.router.navigate([item.target]);
            }
        }
    }
    handleOkMiddle(): void {
        for (let index = 0; index < this.selectData.length; index++) {
            this.selectData[index] = {
                guid: this.selectData[index],
                state: 1
            };
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const obj = JSON.stringify(this.selectData);
        this.isVisibleMiddle = true;
        this.http.patch(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/hrmShortMenu?modifyId=' + this.userID + '&enterpriseId=' + this.service.get().guid + '&type=' + this.service.get().type, obj, { headers: headers }
        ).subscribe((res: any) => {
            if (res.code === 0) {
                this.loadTemplate();
            } else {
                this.msg.error(res.message);
            }
            this.loadTemplate();
            this.isVisibleMiddle = false;
        });
        this.selectData = [];
    }

    /**
     * 使用indexOf判断元素是否存在于数组中
     * @param {Object} arr 数组
     * @param {Object} value 元素值
     */
    isInArray3(arr, value) {
        if (arr.indexOf && typeof (arr.indexOf) === 'function') {
            const index = arr.indexOf(value);
            if (index >= 0) {
                return true;
            }
        }
        return false;
    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;

    }

    /*
    getMessageType(type: string) {
        if (type === 'BIRTHDAY_REMIND') {
            return '生日提醒';
        } else if (type === 'SYSTEM_MESSAGE') {
            return '系统通知';
        } else if (type === 'TO_DO_LIST') {
            return '待办事项';
        } else if (type === 'NOTIFY') {
            return '通知';
        } else if (type === 'NOTICE') {
            return '公告';
        } else {
            return '其它消息';
        }
    }
    */
}
