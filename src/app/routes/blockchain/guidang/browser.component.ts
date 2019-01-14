
import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-browser',
    templateUrl: 'browser.component.html',
    styleUrls: ['./browser.component.less']
})

export class BrowserComponent implements OnInit {
    httpUrl = environment.HRM_URL + 'service/certificate';
    // 等待
    loading = false;
    dataList;

    // 分页相关
    pageTotal = 0;
    pageNum = 1;
    pageSize = 20;
    // 班级列表
    classes;
    // 当前班级guid
    currentItemGuid;
    constructor(private http: HttpClient,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) { }

    ngOnInit() { 
        this.getClasses();
    }
    /**
     * 得到班级列表
     */
    getClasses() {
        this.loading = true;
        this.http.get(this.httpUrl + '/../classes/enterprise-guid', {
            params: {
                enterpriseGuid: this.tokenService.get().enterprisesInfo.enterprisesId,
                pageNum: 1 + '',
                pageSize: 100 + ''
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                
                this.classes = res.data;
                if (this.classes.length) {
                    this.currentItemGuid = this.classes[0].guid;
                    this.getStudents(this.classes[0].guid);
                }
            } else {
                this.classes = [];
            }
            this.loading = false;
        });
    }

    /**
     * 得到学生列表
     * @param classGuid 班级id 
     */
    getStudents(classGuid: any) {
        this.loading = true;
        this.http.get(this.httpUrl + '/status', {
            params: {
                classGuid: classGuid,
                issuingStatus: -1 + '',
                pageNum: this.pageNum + '',
                pageSize: this.pageSize + ''
            }
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.dataList = res.data;
                this.pageTotal = res.total;
            } else {
                this.dataList = [];
                this.pageTotal = 0;
            }
            this.loading = false;
        });
    }

    /**
     * 选中班级
     * @param classItem 
     */
    selectClass(classItem) {
        this.currentItemGuid = classItem.guid;
        this.getStudents(classItem.guid);
    }

}
