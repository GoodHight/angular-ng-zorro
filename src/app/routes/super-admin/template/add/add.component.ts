import {Component, Inject, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {

    public form: FormGroup;
    public dataList: any [];
    public submitting = false;
    tabs: any[] = [{
        key: 'menu/index',
        tab: '功能信息',
    }
    ];
    public menuData = [{
        menuName: '完整版',
        guid: '0'
    }, {
        menuName: '高级版',
        guid: '1'
    }, {
        menuName: '中级版',
        guid: '2'
    }, {
        menuName: '普通版',
        guid: '3'
    }, {
        menuName: '体验版',
        guid: '4'
    }];
    public guid = '';
    public type = '';
    public menuPart = '0';
    public formData = {
        menuAction: '/test',
        menuActionId: '/test',
        menuCss: 'css',
        menuName: '测试菜单  ',
        menuOrder: '1',
        menuParentGuid: '',
    };
    public url = environment.HRM_URL + 'service';

    constructor(private http: HttpClient, private fb: FormBuilder, public msg: NzMessageService, private router: Router, private activatedRoute: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                this.guid = params['guid'];
                return this.type = params['type'];
            });
    }

    public thisUrl = this.url + '/hrm-template-menu/';

    /*
    * 提交
    * */
    public submit() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        this.formData.menuActionId = this.formData.menuAction;
        let navUrl = '/admin/template/index';
        if (this.type === '1') {
            this.thisUrl = this.url + '/app-template-menu/';
            navUrl = '/admin/template/app-index';
        }
        if (this.guid !== '0') {
            this.http.patch(this.thisUrl + this.guid, this.formData, {
                headers: headers,
                params: {menuPart: this.menuPart}
            }).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('修改成功');
                    this.router.navigate([navUrl]).then();
                }
            });
        } else {
            this.http.post(this.thisUrl, this.formData, {
                params: {menuPart: this.menuPart}
            })
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.msg.success('新增成功');
                        this.router.navigate([navUrl]).then();
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }
    }

    /*
    * 编辑获取数据
    * */
    private getData() {
        if (this.type === '1') {
            this.thisUrl = this.url + '/app-template-menu/';
        }
        if (this.guid !== '0') {
            this.http.get(this.thisUrl + this.guid)
                .subscribe((res: any) => {
                    if (res.code === 1) {
                        this.formData = res.data;
                        if (!this.formData.menuAction) {
                            this.formData.menuAction = res.data.menuActionId;
                        }
                        switch (res.data.menuPart) {
                            case 'APP_MENU_ALL' || 'PC_MENU_ALL':
                                this.menuPart = '0';
                                break;
                            case 'APP_MENU_HIGH' || 'PC_MENU_HIGH':
                                this.menuPart = '1';
                                break;
                            case 'APP_MENU_MIDDLE' || 'PC_MENU_MIDDLE':
                                this.menuPart = '2';
                                break;
                            case 'APP_ORDINARY' || 'PC_ORDINARY':
                                this.menuPart = '3';
                                break;
                            case 'APP_EXPERIENCE' || 'PC_EXPERIENCE':
                                this.menuPart = '4';
                                break;
                        }
                        // console.log(this.menuPart);
                    } else {
                        this.msg.error(res.message);
                    }
                });
        }
    }

    /*
    * 获取一级菜单
    * */
    public getDataList() {
        if (this.type === '1') {
            this.thisUrl = this.url + '/app-template-menu/';
        }
        this.http.get(this.thisUrl)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    this.dataList = res.data;
                }
            });
    }

    ngOnInit() {
        this.getData();
        this.getDataList();
        this.form = this.fb.group({
            menuAction: [this.formData.menuAction, [Validators.required]],
            menuParentGuid: [this.formData.menuParentGuid],
            menuCss: [this.formData.menuCss, [Validators.required]],
            menuName: [this.formData.menuName, [Validators.required]],
            menuPart: [this.menuPart, [Validators.required]],
        });
    }

}
