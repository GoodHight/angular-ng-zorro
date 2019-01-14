import {Component, Inject, OnInit} from '@angular/core';
import {environment} from '@env/environment';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-backlog-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
    public guid: any;
    public url = environment.ACTIVITI_URL + 'service';
    public formData = {
        roleCode: '1200162',
        roleMark: '测试角色',
        roleName: '小傅角色  ',
        roleScope: '1111'
    };
    style = {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
    };
    items = [];
    public dataList = {
        category: 'cat',
        flowDoc: '流程处理描述信息',
        flowID: 'TEST',
        flowName: 'TEST',
        key: 'cat_KEY',
        name: 'TEST1322',
        tenantID: 'zhoubo',
        workflowUserTask: [
            {
                approvalMethod: 0,
                candidateUser: 'zhoubo',
                doc: '处理节点文档描述信息',
                id: 'usertask1',
                name: 'usertask1',
                type: 1
            }
        ]
    };
    datas = [];

    //
    inner = true;

    constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, public msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                return this.guid = params['guid'];
            });
    }

    /*
    * 获取列表数据
    * */
    getData() {
        this.http.get(this.url + '/workflow/' + this.tokenService.get().loginEid + '/' + this.tokenService.get().userGuid)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.datas = res.data;
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    /*
    * 详情
    * */
    details(guid: any) {
        this.router.navigate(['/workflow/design/details/', {guid: guid}]);
    }

    /*
    * 编辑
    * */
    update(guid: any) {
        this.router.navigate(['/workflow/design/update/', {guid: guid}]);
    }

    /*
    * 工作流程的操作
    * */
    operation() {

    }

    ngOnInit() {
        this.getData();
    }

}
