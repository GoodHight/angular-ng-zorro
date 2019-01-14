import {Component, Inject, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';


@Component({
    selector: 'app-dictionary-management',
    styleUrls: ['./dictionary-management.component.less'],
    templateUrl: './dictionary-management.component.html',
})
export class DictionaryManagementComponent implements OnInit {
    public loading: false;
    public inputVale;
    public listData: any [];
    public modalVisible = false;
    /*
    * 区分新增类型
    * */
    public addType: any;
    /*
    * 区分修改还是新增
    * */
    updateType = 0;
    listTotal = 0;
    url = environment.FRAMEWORK_URL + 'service';
    typeList: any;
    currentId;
    q: any = {
        pageNum: 1,
        pageSize: 20,
        dictType: ''
    };
    public dataList = {
        dictCode: '',
        dictName: '',
        dictParentGuid: '',
        dictState: '',
        dictType: '',
        dictTypeName: '',
        loginEid: this.iTokenService.get().loginEid,
        loginUid: this.iTokenService.get().userGuid,
        remark: ''
    };
    status = [
        {index: 0, text: '关闭', value: false, type: 'default', checked: false},
        {index: 1, text: '启用', value: false, type: 'processing', checked: false}
    ];
    // 编号
    public code = 1;
    /*
    * 新增字典参数
    *
    * */
    guid = '';
    dictCode = '';
    dictParentGuid = '';
    dictName = '';
    dictState = '1';
    remark = '';
    dictType = '';

    constructor(private http: HttpClient, public msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private iTokenService: ITokenService) {

    }

    /*
    * 删除字典
    * */
    delete = (guid: any) => {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams()
            .set('dictGuids', guid);
        this.http.delete(this.url + '/dictionary/', {
            params: body
        }).subscribe((res: any) => {
            if (res.code === 1) {
                this.msg.success('删除成功');
                this.getListData(this.q.dictType, '1');
                setTimeout(() => this.modalVisible = false, 500);
            } else {
                this.msg.success('' + res.message + '');
            }

        });
    }


    getData(value: any) {
        // this.loading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // let body = new HttpParams().set('dictTypeName', this.inputVale);
        this.http.get(this.url + '/dictionary/dictionary-type', {
            params: {dictTypeName: value}
        }).subscribe((res: any) => {
            if (res.code === 1) {
                
                this.typeList = res.data;
                this.loading = false;
            }
            if (res.code !== 1) {
                this.typeList = [];
                this.msg.error('没有分类数据');
                this.loading = false;
            }
        });

    }

    /*
    * 新建字典
    * type 0 = 新增字典 1 = 新增字典类型
    * */
    add(type: any) {
        this.addType = type;
        this.modalVisible = true;
        this.dictName = '';
    }

    /*
    * 获取子菜单的数据
    * */
    public serachData() {


    }

    setDictName(type: any) {
        for (let i = 0; i < this.typeList.length; i++) {
            if (type === 0) {
                if (this.dataList.dictType === this.typeList[i].dictType) {
                    this.dataList.dictName = this.typeList[i].dictName;
                }
            } else {
                if (this.dataList.dictParentGuid === this.typeList[i].dictType) {
                    this.dataList.dictTypeName = this.typeList[i].dictTypeName;
                }
            }
        }
    }

    /*
    * 保存
    * */
    save() {
        if (this.updateType === 0) {
            this.http.post(this.url + '/dictionary', this.dataList).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('添加成功');
                    this.getListData(this.q.dictType, '1');
                    setTimeout(() => this.modalVisible = false, 500);
                } else {
                    this.msg.error(res.message);
                }

            });
        } else {
            this.http.patch(this.url + '/dictionary/' + this.guid, this.dataList).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('修改成功');
                    this.getListData(this.q.dictType, '1');
                    setTimeout(() => this.modalVisible = false, 500);
                } else {
                    this.msg.success('' + res.message + '');
                }

            });
        }

    }

    update(guid: any, dictName: any, dictCode: any, dictState: any, remark: any, dictType: any, dictParentGuid: any, dictTypeName: any) {
        if (dictState === '关闭') {
            dictState = 0;
        } else {
            dictState = 1;
        }
        this.addType = 1;
        this.modalVisible = true;
        this.guid = guid;
        this.dataList.dictCode = dictCode;
        this.dataList.dictName = dictName;
        this.dataList.dictState = dictState;
        this.dataList.remark = remark;
        this.dataList.dictType = this.currentId;
        this.dataList.dictParentGuid = dictTypeName;
        this.dataList.dictTypeName = dictParentGuid;
        this.updateType = 1;
    }

    pageChange(pageNum: number) {
        this.q.pageNum = pageNum;
        // this.loading = true;
        this.getListData(this.q.dictType, '1');
    }

    getListData(code: any, num: any) {
        this.currentId = code;
        if (num === '0') {
            this.q.pageNum = 1;
        }
        this.q.dictType = code;
        this.http.get(this.url + '/dictionary/type', {params: this.q})
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.listData = res.data;
                    this.listTotal = res.total;
                    this.loading = false;
                }
                if (res.code === 0) {
                    this.listData = [];
                    this.listTotal = res.total;
                    this.msg.error(res.message);
                    this.loading = false;
                }
            });
    }

    serachType(event: any) {
        const value = this.inputVale;
        this.getData(value);
    }


    ngOnInit() {
        this.addType = 0;
        this.getData('');
        this.getListData('', '1');
    }

}
