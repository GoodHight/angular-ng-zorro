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
  selector: 'ordercreate',
  templateUrl: './ordercreate.component.html',
  styleUrls: ['./ordercreate.component.less']
})
export class OrdercreateComponent implements OnInit {

  constructor(private http: HttpClient, private nzModal: NzModalService,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    this.route.params
      .subscribe((params: Params) => {
        this.code = params['id'];
      });
  }

  code = '';
  form: FormGroup;
  obj: any;
  num = 1;
  totalnum = 9600;
  dataList = {
    versionName: '',
    versionPrice: 0,
    personCount: 10,
  };
  limit: any;
  enterpriseName = this.tokenService.get().name;
  loading = false;
  httpUrl = environment.SERVER_URL + '/enterprise/';
  _submitForm() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.obj = this.form.value;
    this.obj['orderQuantity'] = this.num;
    this.obj['versionCode'] = this.code;
    this.obj['enterpriseId'] = this.tokenService.get().guid;
    // console.log(this.obj);
    this.http.post(this.httpUrl + 'service/order/addOrder', this.obj, { headers: headers }).subscribe((res: any) => {
      if (res.code === 0) {
        // console.log(res);
        this.router.navigate(['/hrservice/version/orderpay/', res.data]);
        this.loading = false;
      } else {
        this.msg.error(res.message);
        this.loading = false;
      }
    });
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
    this.form = this.fb.group({
      contact: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
    });
    this.http.get(this.httpUrl + 'service/order/getVersionInfoByCode', {
      params: {
        code: this.code,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        // console.log(res);
        this.dataList = res.data;
        this.totalnum = this.dataList.versionPrice;
        if (this.dataList.personCount === -1) {
          this.limit = '无上限';
        } else {
          this.limit = this.dataList.personCount;
        }
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
