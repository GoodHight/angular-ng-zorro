import { Component, EventEmitter, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  policylist: any = [];
  extraData: any = {};
  policyTypelist: any = [];
  // 省
  provinceId: any;
  selectDataShen = [];
  // 市
  cityId: any;
  selectDataShi = [];
  // 区
  areaId: any;
  selectDataQu = [];
  typeId: any;
  str = '';
  activationTlyltle = '';
  form: FormGroup;
  policyId = '';
  private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
  private url = environment.SERVER_URL + environment.POLICY_URL;
  q: any = {
    pageNum: 1,
    pageSize: 20,
    searchStr: '',
    total: 0,
    typeId: ''
  };
  userId = '';
  loading = false;
  isVisible = false;
  apply = false;
  detalislist = [];
  serachState = 0;

  constructor(private router: Router, private http: HttpClient, private modalService: NzModalService, private fb: FormBuilder,
    private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }

  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.getProvinces();
    this.getSelectData();
    this.getData();
    this.form = this.fb.group({
      applyName: ['', [Validators.required]],
      applyPhone: [null, [Validators.required, Validators.pattern(/^1[3|4|5|7|8][0-9]{9}$/)]],
      applyPostion: ['', [Validators.required]],
      officeAddress: ['', [Validators.required]],
    });
  }
  getData() {
    this.loading = true;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.q['userId'] = this.userId,
      this.q['enterpriseId'] = this.tokenService.get().guid,
      this.http.get(this.url + 'service/policy/getEnterprisePageList', { params: this.q }).subscribe((res: any) => {
        if (res.code === 0) {
          this.policylist = res.data;
          this.extraData = res.extraData;
          this.q.total = res.total;
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
      });

  }
  details(guid: any) {
    this.isVisible = true;
    this.loading = true;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.q['guid'] = guid,
      this.http.get(this.url + 'service/policy/getDetailByGuid', { params: this.q }).subscribe((res: any) => {
        if (res.code === 0) {
          this.detalislist = res.data.policyFiles;
        } else {
          this.msg.error(res.message);
        }
        this.loading = false;
      });
    // this.router.navigate(['/policy/index/detalis', guid]);
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  edit(guid) {
    // this.router.navigate(['/policy/index/add', guid]);
  }
  applyShowModel(policyId) {
    this.policyId = policyId;
    this.apply = true;
    this.form.reset();
  }
  applyCancel(): void {
    this.apply = false;
  }
  applyOk(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    const obj = JSON.parse(JSON.stringify(this.form.value));
    obj['userId'] = this.userId;
    obj['policyId'] = this.policyId;
    obj['enterpriseId'] = this.tokenService.get().guid;
    if (obj.applyName === null || obj.applyName === '') {
      return;
    }
    if (obj.applyPhone === null || obj.applyPhone === '') {
      return;
    }
    if (obj.applyPostion === null || obj.applyPostion === '') {
      return;
    }
    if (obj.officeAddress === null || obj.officeAddress === '') {
      return;
    }
    if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(obj.applyPhone))) {
      return;
    }
    this.loading = true;
    this.http.post(this.url + 'service/policyApply/apply', obj).subscribe((value: any) => {
      if (value.code === 0) {
        this.msg.success('操作成功');
        this.getData();
      } else {
        this.msg.error(value.message);
      }
      this.loading = false;
      this.form.reset();
      this.apply = false;
    });
  }
  typeChange(e) {
    if (e !== null) {
      this.q.typeId = e;
      this.getData();
    } else {
      this.q.typeId = '';
      this.getData();
    }
  }
  // 点击调到下一页
  pageChange(pi: number, state: any) {
    if (this.serachState !== 1 || pi > 1) {
      this.serachState = 0;
      this.q.pageNum = pi;
      this.getData();
    }
  }
  /* 
     获取省
 */
  getProvinces() {
    this.http.get(this.dictionaryUrl + 'service/provinces')
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.selectDataShen = res.data;
        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      });
  }
  /* 
      获取市
  */
  CitysListChange(e) {
    this.cityId = null;
    this.areaId = null;
    this.q['provinceId'] = this.provinceId;
    this.q['cityId'] = '';
    this.q['areaId'] = '';
    this.getData();
    if (e !== null) {
      // this.form.value.nativeCityId = '';
      this.http.get(this.dictionaryUrl + 'service/city/' + e)
        .subscribe((res: any) => {
          if (res.code === 0) {
            this.selectDataShi = res.data;
          } else {
            this.msg.error(res.message);
            this.loading = false;
          }
        });
    }
  }
  /* 
      获取区
  */
  CountyListChange(e) {
    this.areaId = null;
    this.q['provinceId'] = this.provinceId;
    this.q['cityId'] = this.cityId;
    this.q['areaId'] = '';
    this.getData();
    if (e !== null) {
      this.http.get(this.dictionaryUrl + 'service/sysAreas/' + e)
        .subscribe((res: any) => {
          if (res.code === 0) {
            this.selectDataQu = res.data;
          } else {
            this.msg.error(res.message);
            this.loading = false;
          }
        });
    }
  }
  // 选择区
  areaListChange(e) {
    if (e !== null) {
      this.q['provinceId'] = this.provinceId;
      this.q['cityId'] = this.cityId;
      this.q['areaId'] = this.areaId;
      this.getData();
    }
  }
  /*
* 获取下拉框数据
* */
  getSelectData() {
    this.http.get(this.dictionaryUrl + 'service/dictionary/all')
      .subscribe((res: any) => {
        if (res.code === 0) {
          res.data.forEach((value: any, key: any) => {
            if (value.dictCode === 'DICT_POLICY_TYPE') {
              this.policyTypelist = value.childrenDictionaries;
            }
          });
          this.loading = false;
        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      });
  }
}

