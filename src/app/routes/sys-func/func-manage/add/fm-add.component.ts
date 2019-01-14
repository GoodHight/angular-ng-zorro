

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';

@Component({
    selector: 'app-fm-add',
    templateUrl: 'fm-add.component.html'
})
export class FmAddComponent implements OnInit {
    loading = false;
    // 请求相关
    httpUrl_F = environment.FRAMEWORK_URL + 'service';
    APP_MENU = '/sys-app-menu';
    PC_MENU = '/sys-menu';
    // 客户端(0: pc，1： 移动)
    client = 0;
    // 是否新增
    isAdd = true;
    // 编辑guid
    editGuid = null;
    // 详情
    editData = null;
    // 表单
    form: FormGroup;
    // 一级菜单
    menuList = [];
    // 菜单序号
    menuIndexs = [];
    menuNums = new Map();
    constructor(
        private activatedRoute: ActivatedRoute,
        private msg: NzMessageService,
        private http: HttpClient,
        private fb: FormBuilder,
        private router: Router
    ) { }

    ngOnInit() {
        // this.parentMenuChange(null);
        this.client = +this.activatedRoute.snapshot.paramMap.get('client');
        this.editGuid = this.activatedRoute.snapshot.paramMap.get('guid');
        if (!this.editGuid) {
            this.isAdd = true;
            this.getMenuList();
        } else {
            this.getDetail(this.editGuid);
            this.isAdd = false;
        }
        this.form = this.fb.group({
            menuParentGuid: [''],
            menuName: [null, [Validators.required]],
            menuCss: [null, [Validators.required]],
            menuAction: [null, [Validators.required]],
            menuBackStyle: [null, [Validators.required]],
            menuIconStyle: [null, [Validators.required]],
            menuLineStyle: [null, [Validators.required]],
            dataScopeIndex: [1],
            menuOrder: [null, [Validators.required]]
        });
        
       
        
        
    }
    /**
     * 获取一级菜单
     */
    getMenuList() {
        this.http.get(this.httpUrl_F + (this.client === 0 ? this.PC_MENU : this.APP_MENU) + '/list').subscribe((res: any) => {
            if (res.code === 1) {
                this.menuList = res.data;
                const length = this.menuList.length;
                this.menuNums.set('all', length);
                for (let i = 0; i < length; i++) {
                    this.menuNums.set(this.menuList[i].guid, this.menuList[i].subMenuList.length);
                }
                this.parentMenuChange(this.editData ? this.editData['menuParentGuid'] : '');
            } else {
                this.msg.error(res.message);
            }
        });
    }
    /**
     * 获取详情
     * @param guid 
     */
    getDetail(guid: any) {
        this.http.get(this.httpUrl_F + (this.client === 0 ? this.PC_MENU : this.APP_MENU) + '/' + guid).subscribe((res: any) => {
            if (res.code === 1) {
                this.editData = res.data;
                this.form.setValue({
                    menuParentGuid: this.editData.menuParentGuid,
                    menuName: this.editData.menuName,
                    menuCss: this.editData.menuCss,
                    menuAction: this.editData['menuAction'] ? this.editData['menuAction'] : this.editData['menuActionId'],
                    menuBackStyle: this.editData.menuBackStyle,
                    menuIconStyle: this.editData.menuIconStyle,
                    menuLineStyle: this.editData.menuLineStyle,
                    dataScopeIndex: 1,
                    menuOrder: +this.editData.menuOrder
                });
                this.getMenuList();
            } else {
                this.msg.error(res.message);
            }
        });
    }
    /**
     * 选择上级菜单变化
     * @param menu 菜单 
     */
    parentMenuChange(menu) {
        let length = 0;
        if (menu) {
            length = this.menuNums.get(menu);
        } else {
            length = this.menuNums.get('all');
        }
        this.menuIndexs = [];
        for (let i = 0; i < length; i++) {
            this.menuIndexs.push(i);
        }
        if (this.menuIndexs.length === 0) {
            this.menuIndexs.push(0);
        }
    }

    submit() {
        const obj = this.form.value;
        let navurl = 'sysfunc/funcmanage/index/';
        if (this.client === 1) {
            obj['menuActionId'] = obj.menuAction;
            navurl = navurl + 'app';
        } else {
            navurl = navurl + 'pc';
        }
        if (this.isAdd) {
            this.http.post(this.httpUrl_F + (this.client === 0 ? this.PC_MENU : this.APP_MENU), obj).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('新增成功！');
                    this.router.navigate([navurl]);
                } else {
                    this.msg.error(res.message);
                }
            });
        } else {
            this.http.patch(this.httpUrl_F + (this.client === 0 ? this.PC_MENU : this.APP_MENU) + '/' + this.editGuid, obj).subscribe((res: any) => {
                if (res.code === 1) {
                    this.msg.success('修改成功！');
                    this.router.navigate([navurl]);
                } else {
                    this.msg.error(res.message);
                }
            });
        }
    }
}
