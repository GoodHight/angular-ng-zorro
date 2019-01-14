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
  selector: 'orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.less']
})
export class OrderdetailComponent implements OnInit {

  constructor(private http: HttpClient, private nzModal: NzModalService,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    this.route.params
      .subscribe((params: Params) => {
        this.guid = params['guid'];
      });
  }

  guid = '';
  form: FormGroup;
  obj: any;
  num = 1;
  totalnum = 9600;
  dataList: any = {
    versionName: '',
    versionPrice: 0,
    personCount: 10,
    orderNumber: '',
    orderTime: '',
    productName: '',
    unitPrice: '',
    contact: '',
    phone: '',
    orderQuantity: '',
    totalPrice: '',
    status: 0,
    guid: '',
  };
  limit: any;
  enterpriseName = this.tokenService.get().name;
  loading = false;
  httpUrl = environment.SERVER_URL + environment.ORDER_URL;
  _submitForm() {
    this.router.navigate(['/hrservice/account/orderpay/', this.dataList.orderNo]);
  }
  cancel() {
    this.router.navigate(['/hrservice/version']);
  }
  add() {
    this.num = this.num + 1;
    this.totalnum = this.num * this.dataList.versionPrice;
  }
  jian() {
    if (this.num > 1) {
      this.num = this.num - 1;
      this.totalnum = this.num * this.dataList.versionPrice;
    }
  }
  ngOnInit() {
    this.http.get(this.httpUrl + 'service/order/getOrderById', {
      params: {
        orderId: this.guid,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        // console.log(res);
        this.dataList = res.data;
        this.totalnum = this.dataList.versionPrice;
        // if (this.dataList.status === -1) {
        //   this.limit = '无上限';
        // } else {
        //   this.limit = this.dataList.status;
        // }
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
