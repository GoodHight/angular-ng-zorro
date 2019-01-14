import {Component, OnInit} from '@angular/core';
import {environment} from '@env/environment';
import {ActivatedRoute, Params} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

    public guid: any;
    public url = environment.HRM_URL + 'service';
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
    showMask = false;
    approveType = '0';
    /*审批方式*/
    approveWay = '0';
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
    public dataCandidate = {
        approvalMethod: '0',
        candidateUser: '',
        approvalUser: '',
        doc: '处理节点文档描述信息',
        id: 'usertask1',
        name: 'usertask1',
        type: '0'
    };
    //
    inner = true;

    constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                return this.guid = params['guid'];
            });
    }

    /*
  * 编辑获取数据
  * */
    private getData() {
        this.http.get(this.url + '/hrm-role/' + this.guid)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    if (res.data.isTemplet === 0) {
                        res.data.isTemplet = '0';
                    } else {
                        res.data.isTemplet = '1';
                    }
                    this.formData = res.data;
                }
            });
    }

    // 控制弹框的显现
    toggleMask() {
        if (this.showMask) {
            this.showMask = false;
        } else {
            this.showMask = true;
        }
    }

    /*
    * 删除审批人节点
    * */
    deleteStream(index: any) {
        this.items.splice(index, 1);
    }

    /*
    * 保存节点
    * */
    saveApproval() {
        if (this.dataCandidate.candidateUser !== '') {
            const objs = {
                candidateUser: this.dataCandidate.candidateUser
            };
            this.items.push(objs);
            this.showMask = false;
        }
    }

    /*
    * 获取审核人
    * */
    getApprovalName() {
        switch (this.dataCandidate.approvalUser) {
            case '0':
                this.dataCandidate.candidateUser = '直接主管';
                break;
            case '1':
                this.dataCandidate.candidateUser = '第2级主管';
                break;
            case '2':
                this.dataCandidate.candidateUser = '第3级主管';
                break;
        }
    }

    ngOnInit() {
        // this.getData();
    }

}
