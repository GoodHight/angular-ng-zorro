import {Component, Inject, OnInit} from '@angular/core';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {HttpClient} from '@angular/common/http';
import {Params, Router, ActivatedRoute} from '@angular/router';
import {environment} from '@env/environment';
import {NzMessageService} from 'ng-zorro-antd';
import {ACLService} from '@delon/acl';
import {MenuService} from '@delon/theme';

@Component({
    selector: 'app-spin-size',
    templateUrl: './loading.component.html',
})

export class LoadingComponent implements OnInit {
    private loginUrl = environment.FRAMEWORK_URL + 'service';
    private hrmUrl = environment.SERVER_URL + environment.USER_URL;
    private type: any;

    constructor(@Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService,
                private _http: HttpClient,
                private router: Router,
                private menuService: MenuService,
                public msg: NzMessageService,
                private route: ActivatedRoute,
                private aclService: ACLService) {


    }

    /*
    * 获取用户权限相关
    * */
    getUserRole() {
        this._http.get(this.hrmUrl + 'service/user/getLoginUserInfo/' + this.reuseTabService.get().guid, {
            params: {
                client: 'pc'
            }
        })
            .subscribe((res: any) => {
                if (res.code === 0) {
                    const enterprisesInfo = {
                        enterprisesName: '',
                        enterprisesId: ''
                    };
                    const roleCode = 'all';
                    const userGuid = res.data.enterpriseGuid;
                    // 处理目录菜单
                    const currentMenus = [];
                    // for (const i of res.data.menuLists) {
                    //     const menu = {};
                    //     menu['text'] = i.menuName;
                    //     menu['i18n'] = '';
                    //     menu['link'] = i.menuAction;
                    //     menu['icon'] = i.menuIconStyle;
                    //     if (i.subMenuList.length > 0) {
                    //         menu['children'] = [];
                    //         for (const subItem of i.subMenuList) {
                    //             const subMenu = {};
                    //             subMenu['text'] = subItem.menuName;
                    //             subMenu['i18n'] = '';
                    //             subMenu['link'] = subItem.menuAction;
                    //             subMenu['icon'] = subItem.menuIconStyle;
                    //             menu['children'].push(subMenu);
                    //         }
                    //     }
                    //     currentMenus.push(menu);
                    // }
                    // const compconsteMenu = [{
                    //     'text': '工作台',
                    //     'i18n': 'main_navigation',
                    //     'group': true,
                    //     'children': currentMenus
                    // }];
                    const name = res.data.name || res.data.phone;
                    this.reuseTabService.set({
                        guid: res.data.guid,
                        token: this.reuseTabService.get().token,
                        nickName: res.data.nickName,
                        name: name,
                        isAuth: res.data.isAuth,
                        idNumber: res.data.idNumber,
                        phone: res.data.phone,
                        securityPassword: res.data.securityPassword,
                        sign: res.data.sign,
                        userContacts: res.data.userContacts,
                        userEducations: res.data.userEducations,
                        userEmployments: res.data.userEmployments
                    });
                    const getRole = [];
                    getRole.push(roleCode);
                    // this.menuService.add(compconsteMenu);
                    this.menuService.resume();
                    // ACL：设置权限为全量
                    if (roleCode === 'all') {
                        this.aclService.setFull(true);
                    } else {
                        this.aclService.setRole(getRole);
                    }
                    this.router.navigate(['/']);
                }
            });
    }


    ngOnInit() {
        this.route.params
            .subscribe((params: Params) => {
                return this.type = params['type'];
            });
        /*type 区分入口 进行不同的操作*/
        // if (this.type === '0') {
        //     setTimeout(this._login(), 5000);
        // }
        // if (this.type === '1') {
        setTimeout(this.getUserRole(), 5000);
        // }
    }

}
