import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient } from '@angular/common/http';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  httpUrl = environment.SERVER_URL + '/contract/';
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
  filename = '';
  filesize: any;
  typeList = [];
  pageNum: any = 1;
  pageSize: any = 20;
  dictType: any = 'CONTRACT_TYPE';

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
    this.uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&escrowType=INFO_STORAGE_RECORD';
    // this.getpeople();
    this.validateForm = this.fb.group({
      type: ['', [Validators.required]],
      name: ['', [Validators.required]],
      versions: [''],
      remark: [''],
    });
  }

  beforeUpload = (file: File) => {
    console.log(file);
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    const isBMP = file.type === 'image/bmp';
    const isICON = file.type === 'image/x-icon';
    if (isJPG || isPNG || isGIF || isBMP || isICON) {
      this.nzMessage.error('只能传PDF和WORD格式文件!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.nzMessage.error('文件大小不能超过 10MB!');
    }
    return !isJPG && !isPNG && !isGIF && !isBMP && !isICON && isLt10M;
  }


  // 上傳的監控
  filedisabled = false;
  handleChange(info: { file: UploadFile }, type: any): void {
    if (this.filedisabled === true) {
      this.filedisabled = false;
    } else {
      this.filedisabled = true;
    }
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.nzMessage.success('上传成功');
      // console.log(info, type, this.fileList[type][0].response.extraData.fileUrl);
      if (type === 0) {
        const length = this.fileList[0].length;
        this.fileId = this.fileList[type][0].response.extraData.fileUrl || '';
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
      }
    }
  }

  getDictionaries() {
    this.http.get(environment.SERVER_URL + environment.COMMONS_URL + 'service/dictionary/type', {
      params: {
        dictType: this.dictType,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
    })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.typeList = res.data;
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
      this.nzMessage.error('请上传合同文件');
      return;
    }
    this.loading = true;
    const obj = JSON.parse(JSON.stringify(this.validateForm.value));
    obj['url'] = this.fileId;
    obj['enterpriseId'] = this.tokenService.get().guid;
    this.http.post(this.httpUrl + 'service/contractTemplate/save', obj).subscribe((value: any) => {
      if (value.code === 0) {
        this.nzMessage.success('新增成功');
        this.router.navigate(['/contract/template/list']);
      } else {
        this.nzMessage.error(value.message);
      }
      this.loading = false;
    });
  }
  cancel() {
    this.router.navigate(['/contract/template/list']);
  }

}
