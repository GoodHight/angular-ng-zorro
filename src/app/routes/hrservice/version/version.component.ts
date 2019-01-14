import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { _Validators } from '@delon/util';

@Component({
  selector: 'version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.less']
})
export class VersionComponent implements OnInit {

  constructor(private http: HttpClient, private nzModal: NzModalService,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }


  httpUrl = environment.SERVER_URL + '/enterprise/';
  tab: any;
  public tabSelectIndex = 0;
  tabs = [{
    key: '/hrservice/version',
    tab: '版本套餐',
  }];
  dataList = {
    expiredTime: '',
    enterpriseId: '',
    personCount: 0,
    versionId: '',
    versionName: '',
  };
  version = [{
    name: '基础版',
    btn: '已启用',
    color: 'green',
    img: '../../../../assets/img/pic_basics.png',
    btndisabled: true,
    id: '1'
  }, {
    name: '创业版',
    btn: '立即使用',
    color: 'blue',
    img: '../../../../assets/img/pic_starbusiness_n.png',
    btndisabled: false,
    id: '2'
  }, {
    name: '尊享版',
    btn: '立即购买',
    color: 'blue',
    img: '../../../../assets/img/pic_hight_n.png',
    btndisabled: false,
    id: '3'
  }, {
    name: '专享版',
    btn: '立即购买',
    color: 'blue',
    img: '../../../../assets/img/pic_hight_n.png',
    btndisabled: false,
    id: '4'
  }];
  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }
  getData() {
    this.http.get(this.httpUrl + 'service/enterprise/version/getVersionByEnterpriseGuid', {
      params: {
        enterpriseGuid: this.tokenService.get().guid,
      }
    }).subscribe((res: any) => {
      // console.log(res);
      if (res.code === 0) {
        this.dataList = res.data;
        if (this.dataList.versionName === '创业版') {
          this.version[1].btn = '已启用';
          this.version[1].color = 'green';
          this.version[1].img = '../../../../assets/img/pic_starbusiness_s.png';
          this.version[1].btndisabled = true;
        }
        if (this.dataList.versionName === '尊享版') {
          this.version[1].btn = '已启用';
          this.version[1].color = 'green';
          this.version[1].img = '../../../../assets/img/pic_starbusiness_s.png';
          this.version[1].btndisabled = true;
          this.version[3].btn = '已启用';
          this.version[3].color = 'green';
          this.version[3].img = '../../../../assets/img/pic_syb_s.png';
          this.version[3].btndisabled = true;
          this.version[2].btn = '已启用 | 续费';
          this.version[2].color = 'green';
          this.version[2].img = '../../../../assets/img/pic_hight_s.png';
          this.version[2].btndisabled = false;
        }
        if (this.dataList.versionName === '专享版') {
          this.version[1].btn = '已启用';
          this.version[1].color = 'green';
          this.version[1].img = '../../../../assets/img/pic_starbusiness_s.png';
          this.version[1].btndisabled = true;
          this.version[3].btn = '已启用 | 续费';
          this.version[3].color = 'green';
          this.version[3].img = '../../../../assets/img/pic_syb_s.png';
          this.version[3].btndisabled = false;
        }
      } else {
        this.msg.error(res.message);
      }
    });
  }
  btn01() {
    // console.log('click1');
  }
  btn02() {
    this.nzModal.confirm({
      nzContent: '升级版本套餐需要完成企业实名认证',
      nzOkText: '去认证',
      nzOnOk: () => {
        this.router.navigate(['/my/authenticate']);
      },
      nzCancelText: '取消'
    });
  }
  btn03(guid) {
    if (this.dataList.versionName === '基础版') {
      this.nzModal.confirm({
        nzContent: '升级版本套餐需要完成企业实名认证',
        nzOkText: '去认证',
        nzOnOk: () => {
          this.router.navigate(['/my/authenticate']);
        },
        nzCancelText: '取消'
      });
    } else {
      this.router.navigate(['/hrservice/version/ordercreate/', guid]);
    }
  }

  ngOnInit() {
    this.getData();
  }
}
