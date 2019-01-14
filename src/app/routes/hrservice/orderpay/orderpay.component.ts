import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { MenuService } from '@delon/theme';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { _Validators } from '@delon/util';
import * as html2canvas from 'html2canvas';
declare let require: any;
const QRCode = require('qrcode');

@Component({
  selector: 'orderpay',
  templateUrl: './orderpay.component.html',
  styleUrls: ['./orderpay.component.less']
})
export class OrderpayComponent implements OnInit {

  constructor(private http: HttpClient, private nzModal: NzModalService,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private menuService: MenuService) {
    this.route.params
      .subscribe((params: Params) => {
        this.id = params['id'];
      });
  }

  intervalTest = undefined;
  anticon = 'anticon-check-circle';
  Countdown = '';
  tradeStatus = 2;
  isvisible = 'isvisiblenone';
  id = '';
  qrCode = '';
  img = '';
  userID = '';
  form: FormGroup;
  obj: any;
  wechattext = '';
  titiletext = '订单提交成功，请尽快支付';
  payType = 'ALIPAY';
  alipayactive = 'active';
  wechatactive = '';
  dataList = {
    orderNumber: '',
    totalPrice: 0,
    productName: '',
    contact: '',
    phone: '',
    expiredPayTime: '',
    currentTime: '',
    payTypeEnum: '',
    orderNo: '',
  };
  year = '';
  Mon = '';
  Day = '';
  M = '';
  S = '';
  H = '';
  Dyear = '';
  DMon = '';
  DDay = '';
  DM = '';
  DS = '';
  DH = '';
  realYear = 0;
  realMon = 0;
  realDay = 0;
  realH = 0;
  realM = 0;
  realS = 0;
  enterpriseName = this.tokenService.get().name;
  refreshData: any;
  cancel() {
    this.router.navigate(['/hrservice/version/order']);
  }
  alipay() {
    this.alipayactive = 'active';
    this.wechatactive = '';
    this.payType = 'ALIPAY';
    this.isvisible = 'isvisiblenone';
    this.isLoadingOne = false;
    clearInterval(this.refreshData);
  }
  wechat() {
    this.alipayactive = '';
    this.wechatactive = 'active';
    this.payType = 'WXPAY';
    this.isLoadingOne = false;
    clearInterval(this.refreshData);
  }
  expiredPayTime() {
    this.Dyear = this.dataList.expiredPayTime.substr(0, 4);
    this.DMon = this.dataList.expiredPayTime.substr(4, 2);
    this.DDay = this.dataList.expiredPayTime.substr(6, 2);
    this.DH = this.dataList.expiredPayTime.substr(8, 2);
    this.DM = this.dataList.expiredPayTime.substr(10, 2);
    this.DS = this.dataList.expiredPayTime.substr(12, 2);
    this.year = this.dataList.currentTime.substr(0, 4);
    this.Mon = this.dataList.currentTime.substr(4, 2);
    this.Day = this.dataList.currentTime.substr(6, 2);
    this.H = this.dataList.currentTime.substr(8, 2);
    this.M = this.dataList.currentTime.substr(10, 2);
    this.S = this.dataList.currentTime.substr(12, 2);
    this.realYear = parseInt(this.Dyear, 10) - parseInt(this.year, 10);
    this.realMon = parseInt(this.DMon, 10) - parseInt(this.Mon, 10);
    this.realDay = parseInt(this.DDay, 10) - parseInt(this.Day, 10);
    this.realH = parseInt(this.DH, 10) - parseInt(this.H, 10);
    this.realM = parseInt(this.DM, 10) - parseInt(this.M, 10);
    this.realS = parseInt(this.DS, 10) - parseInt(this.S, 10);
    if (this.realH < 0 || this.realYear < 0 || this.realMon < 0 || this.realDay < 0) {
      this.Countdown = '00:00';
      this.btndisabled = true;
    } else {
      if (this.realS < 0) {
        this.realS = 60 + this.realS;
        this.realM = this.realM - 1;
      }
      if (this.realH > 0 && this.realM < 0) {
        this.realM = 60 + this.realM;
        this.realH = this.realH - 1;
      }
      this.intervalTest = setInterval(() => {
        this.realS = this.realS - 1;
        if (this.realS < 0) {
          this.realS = 59;
          this.realM = this.realM - 1;
        }
        if (this.realM < 10 && this.realS > 9) {
          this.Countdown = '0' + this.realM + ':' + this.realS;
        } else if (this.realM < 10 && this.realS < 10) {
          this.Countdown = '0' + this.realM + ':' + '0' + this.realS;
        } else if (this.realM > 9 && this.realS < 10) {
          this.Countdown = this.realM + ':' + '0' + this.realS;
        } else {
          this.Countdown = this.realM + ':' + this.realS;
        }
        if (this.realM < 0) {
          this.Countdown = '00:00';
          this.btndisabled = true;
          clearInterval(this.intervalTest);
        }
      }, 1000);
    }
  }
  // 钩子
  // ngAfterViewInit() {
  //   // 监听路由变化 停止查询菜单状态循环
  //   this.router.events
  //     .subscribe((event: NavigationEnd) => {
  //       clearInterval(this.refreshData);
  //     });
  // }
  refresh() {
    this.refreshData = setInterval(() => {
      this.http.get(this.httpUrlPay + 'service/trade/info?orderNumber=' + this.dataList.orderNumber + '&userId=' + this.userID).subscribe((res: any) => {
        console.log(res);
        if (res.data.tradeStatus === 'SUCCESS') {
          this.tradeStatus = 0;
          this.titiletext = '订单支付成功！';
          this.anticon = 'anticon-check-circle';
          this.isvisible = 'isvisiblenone';
          clearInterval(this.refreshData);
          const musns = JSON.parse(localStorage.getItem('_token'));
          // 清空路由复用信息
          this.tokenService.clear();
          const currentMenus = [];
          for (const i of res.extraData) {
            const menu = {};
            menu['text'] = i.name;
            menu['i18n'] = '';
            menu['link'] = i.href;
            menu['icon'] = i.icon;
            if (i.subMenus.length > 0) {
              menu['children'] = [];
              for (const subItem of i.subMenus) {
                const subMenu = {};
                subMenu['text'] = subItem.name;
                subMenu['i18n'] = '';
                subMenu['link'] = subItem.href;
                subMenu['icon'] = subItem.icon;
                menu['children'].push(subMenu);
              }
            }
            currentMenus.push(menu);
          }
          const completeMenu = [{
            'text': '工作台',
            'i18n': 'main_navigation',
            'group': true,
            'children': currentMenus
          }];
          musns.completeMenu = currentMenus;
          localStorage.setItem('_token', JSON.stringify(musns));
          console.log(musns);
          this.menuService.add(completeMenu);
          this.menuService.resume();
        } else if (res.data.tradeStatus === 'PAYERROR') {
          this.tradeStatus = 1;
          this.titiletext = '订单支付失败，请尽快重新支付';
          this.anticon = 'anticon-close-circle';
          clearInterval(this.refreshData);
        }
        this.loading = false;
      });
    }, 5000);
  }
  isLoadingOne = false;
  btndisabled = false;
  loading = false;
  httpUrl = environment.SERVER_URL + '/enterprise/';
  httpUrlPay = environment.SERVER_URL + '/pay/';
  _submitForm() {
    if (this.payType === 'ALIPAY') {
      window.open(this.httpUrlPay + 'service/trade/pay?orderNumber=' + this.dataList.orderNumber + '&payTypeEnum=' + this.payType);
      this.isvisible = 'isvisiblenone';
      this.isLoadingOne = true;
    } else {
      this.isLoadingOne = true;
      this.wechattext = '请扫一扫二维码付款';
      this.img = this.httpUrlPay + 'service/trade/pay?orderNumber=' + this.dataList.orderNumber + '&payTypeEnum=' + this.payType;
      this.isvisible = 'isvisibleblock';
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.refresh();
  }
  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userID = this.tokenService.get().guid;
    } else {
      this.userID = this.tokenService.get().userId;
    }
    this.http.get(this.httpUrl + 'service/order/getOrderByGuid', {
      params: {
        orderGuid: this.id,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.qrCode = res.data.qrCode;
        this.dataList = res.data;
        this.expiredPayTime();
        this.loading = false;
      } else {
        this.msg.error(res.message);
        this.loading = false;
      }
    });

  }
  download() {
    window.open(environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/byFileType?fileType=PROTOCOL_SOFTWARE_SERVICE');
  }
}
