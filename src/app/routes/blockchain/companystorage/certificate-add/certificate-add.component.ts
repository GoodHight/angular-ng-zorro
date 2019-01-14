import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient } from '@angular/common/http';
import { Alert } from 'selenium-webdriver';


@Component({
  selector: 'certificate-add',
  templateUrl: './certificate-add.component.html',
  styleUrls: ['./certificate-add.component.less']
})
export class CertificateAddComponent implements OnInit {
  httpUrl = environment.SERVER_URL + '/storage/';
  deptUrl = environment.SERVER_URL + environment.ENTERPRISE_URL;
  // 页面数据加载等待
  loading;
  // 确认按钮等待状态
  confirmButtonLoading = false;
  editData;
  dictionaries = [];
  peoplelits = [];
  // 文件存放
  fileList = [[]];
  previewImage = '';
  previewVisible = false;
  nzMultiplea = true;
  numberss = 1;
  userID = '';
  uploaderGradUrl = '';
  fileId = '';
  storageType = '';
  validateForm: FormGroup;

  constructor(
    private http: HttpClient, private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private nzMessage: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) { }

  ngOnInit() {
    if (this.tokenService.get().type === 1) {
      this.userID = this.tokenService.get().guid;
    } else {
      this.userID = this.tokenService.get().userId;
    }
    this.getDictionaries();
    this.uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=INFO_STORAGE_RECORD' + '&loginEid=' + this.tokenService.get().guid;
    // this.getpeople();
    this.validateForm = this.fb.group({
      storageName: ['', [Validators.required]],
      storageRemark: [''],
      storageTypeId: ['', [Validators.required]],
    });
  }


  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  // handleChange(info: { file: UploadFile, fileList: UploadFile }, type: any): void {
  //   // console.log(info.fileList);
  //   const fileList = info.fileList;
  //   this.fileId = '';
  //   if (info.file.status === 'done') {
  //     this.nzMessage.success('上传成功');
  //     this.fileId = info.file.response.data || '';
  //   } else if (info.file.status === 'removed') {
  //     this.fileId = '';
  //   }
  //   if (info.file.status === 'uploading') {
  //     return;
  //   }
  // }
  // 上傳的監控
  handleChange(info: { file: UploadFile }, type: any): void {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.nzMessage.success('上传成功');
      if (type === 0) {
        const length = this.fileList[0].length;
        this.fileId = this.fileList[type][0].response.data || '';
        const obj1 = {
          uid: info.file.uid,
          name: info.file.name,
          status: 'done',
          thumbUrl: './assets/img/template/other.png',
        };
        this.fileList[0][length - 1] = obj1;
      }
    } else if (info.file.status === 'removed') {
      if (type === 0) {
        this.fileId = '';
        // this.delFileIds.push(info.file.response.data);
      }
    }
  }
  getDictionaries() {
    this.http.get(environment.SERVER_URL + environment.COMMONS_URL + 'service/dictionary/all')
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.dictionaries = res.data;
          res.data.forEach((value: any, key: any) => {
            if (value.dictCode === 'INFO_STORAGE_DIC_TYPE') {
              this.peoplelits = value.childrenDictionaries;
            }
          });
        } else {
          this.nzMessage.error(res.message);
          this.loading = false;
        }
      });
  }
  getpeople() {
    this.http.get(this.deptUrl + 'service/employee/enterprise', {
      params: {
        enterpriseGuid: this.tokenService.get().guid
      }
    })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.peoplelits = res.data;
        } else {
          this.nzMessage.error(res.message);
          this.loading = false;
        }
      });
  }
  _setValidateForm() {

  }

  save() {
    if (this.fileId === '') {
      this.nzMessage.error('请上传存证文件');
      return;
    }
    this.loading = true;
    const obj = JSON.parse(JSON.stringify(this.validateForm.value));
    this.peoplelits.forEach((value: any, key: any) => {
      if (value.guid === this.validateForm.get('storageTypeId').value) {
        this.storageType = value.dictName;
      }
    });
    obj['storageType'] = this.storageType;
    obj['fileId'] = this.fileId;
    obj['storageUser'] = this.userID;
    this.http.post(this.httpUrl + 'service/infoStorage', obj).subscribe((value: any) => {
      if (value.code === 0) {
        this.nzMessage.success('新增成功');
        this.router.navigate(['/blockchain/companystorage/index']);
      } else {
        this.nzMessage.error(value.message);
      }
      this.loading = false;
    });
  }
  cancel() {
    this.router.navigate(['/blockchain/companystorage/index']);
  }
}
