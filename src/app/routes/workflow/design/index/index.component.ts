import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';

@Component({
    selector: 'app-design-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

    public guid: any;
    public url = environment.ACTIVITI_URL + 'service';
    public formData = {
        roleCode: '',
        roleMark: '',
        roleName: '  ',
        roleScope: ''
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
    datas: any[] = [];
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
        this.http.get(this.url + '/workflow/repository/definition', {
            params: {
                enterpriseID: this.tokenService.get().loginEid,
                catalogID: ''
            }
        })
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

    ngOnInit() {
        this.getData();
    }
}
