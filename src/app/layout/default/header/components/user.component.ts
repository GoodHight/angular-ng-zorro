import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService, User } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { locateHostElement } from '@angular/core/src/render3/instructions';

@Component({
    selector: 'header-user',
    template: `
        <nz-dropdown nzPlacement="bottomRight">
            <div class="item d-flex align-items-center px-sm" nz-dropdown>
                <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
                {{userName}}
            </div>
            <div nz-menu class="width-sm">
                <div nz-menu-item [routerLink]="['/business-management/business-info']"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
                <!--<div nz-menu-item (click)="updatePassword()"><i class="anticon anticon-user mr-sm"></i>修改密码</div>-->
                <!--<div *ngIf="isCompany" nz-menu-item [routerLink]="['/business-management/business-info']"><i
                        class="anticon anticon-setting mr-sm"></i>账号设置
                </div>
                <div *ngIf="!isCompany" nz-menu-item [routerLink]="['/usercenter/personInfo']"><i
                        class="anticon anticon-setting mr-sm"></i>账号设置
                </div>-->
                <!--<li nz-menu-divider></li>-->
                <div nz-menu-item (click)="updatePassword()"><i class="anticon anticon-setting mr-sm"></i>修改密码</div>
                <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
            </div>
        </nz-dropdown>
    `
})
export class HeaderUserComponent implements OnInit {
    constructor(public settings: SettingsService,
        private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private aclService: ACLService) {
    }

    userName: any;
    userPhone: string = null;
    // 是否是企业
    isCompany = false;
    ngOnInit(): void {
        this.userName = this.tokenService.get().name;
        this.userPhone = this.tokenService.get().phone;
        if (this.tokenService.get().name == null || this.tokenService.get().name === '') {
            this.userName = JSON.parse(localStorage.getItem('userInfo')).name;
            if (this.userName == null || this.userName === '') {
                this.userName = JSON.parse(localStorage.getItem('userInfo')).phone;
            }
            this.userPhone = JSON.parse(localStorage.getItem('userInfo')).phone;
        }
        // // console.log(this.userPhone);
        this.isCompany = this.userPhone && this.userPhone.includes('@');
        // this.tokenService.change().subscribe((res: any) => {
        //     this.settings.setUser(res);
        // });
        // this.settings.setUser(this.tokenService.get().userName);
    }

    updatePassword() {
        this.router.navigate(['/my/update-password']);
    }

    logout() {
        const roleName = this.tokenService.get().roleCode;
        localStorage.removeItem('userInfo');
        if (roleName && roleName !== 'all') {
            this.aclService.removeRole(roleName);
        } else {
            this.aclService.setFull(false);
        }
        this.tokenService.clear();
        this.router.navigateByUrl(this.tokenService.login_url);
    }
}
