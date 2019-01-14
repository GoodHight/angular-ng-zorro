import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import * as html2canvas from 'html2canvas';
declare let require: any;
const QRCode = require('qrcode');

@Component({
  selector: 'template-add',
  templateUrl: './template-add.component.html',
  styleUrls: ['./template-add.component.less']
})
export class TemplateAddComponent implements OnInit {
  loading = false;
  userID = '';
  uploaderGradUrl = '';
  contentData: any = {};
  qrCode = '';
  public form: FormGroup;
  sysTemplateFileId = ''; // 默认系统模板id
  downHref = ''; // 下载
  payCardId = ''; // 上传成功后文件id
  b64 = '';
  templatePreviewFileId = ''; // 预览模板id
  styletype = 'no';
  styletypes = 'no';
  // 文件存放
  fileList = [[]];
  previewImage = '';
  previewVisible = false;
  canvasImg = '';
  backgroundurl = '';
  background = {
    'background-image': '',
  };
  templateUrl = environment.SERVER_URL + environment.TRAINING_URL;
  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private message: NzMessageService) {
    if (this.tokenService.get().type === 1) {
      this.userID = this.tokenService.get().guid;
    } else {
      this.userID = this.tokenService.get().userId;
    }
    this.uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userID + '&escrowType=HRM_TEMP_TRAINING_CERTIFICATE' + '&loginEid=' + this.tokenService.get().guid;

  }
  ngOnInit() {
    this.getTemplate();
    this.form = this.fb.group({
      // 员工社保信息
      templateName: [null, [Validators.required]],
    });
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  // 上傳的監控
  handleChange(info: { file: UploadFile }, type: any): void {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // console.log(info.file);
      this.msg.success('上传成功');
      this.styletypes = 'yes';
      if (type === 0) {
        this.payCardId = this.fileList[type][0].response.data || '';
      }
      this.backgroundurl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + this.payCardId; // 去获取背景图
      this.getData(); // 生成图片

    } else if (info.file.status === 'removed') {
      if (type === 0) {
        this.payCardId = '';
        // this.delFileIds.push(info.file.response.data);
      }
    }
  }

  getData() { // 生成图片
    const backgroundurl = 'url(' + this.backgroundurl + ')';
    this.background = {
      'background-image': backgroundurl,
    };
    setTimeout(() => {
      this.canvasImg = '';
      const id = this.message.loading('模板生成中...', { nzDuration: 0 }).messageId;
      html2canvas(document.querySelector('#capture'), { useCORS: true }).then(canvas => {
        this.canvasImg = canvas.toDataURL('image/png');
        this.postBase();
        this.styletype = 'yes';
        this.message.remove(id);
      });
    }, 1000);
  }
  // 获取默认模板id
  getTemplate() {
    this.http.get(this.templateUrl + 'service/training/sys')
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.sysTemplateFileId = res.data.sysTemplateFileId;
          this.contentData = res.data;
          this.qrCode = res.data.qrCode;
          this.erweima();
        } else {
          this.msg.error(res.message);
          this.loading = false;
        }
      });
  }
  // 上传base64（预览图）
  postBase() {
    const form = new FormData();
    form.append('fileBase64', this.canvasImg);
    form.append('loginEid', this.tokenService.get().guid);
    form.append('escrowType', 'PREVIEW_TRAINING_CERTIFICATE');
    form.append('loginUid', this.userID);
    this.http.post(environment.UPLOADER_URL + environment.FILE_URL + 'service/files/base64', form).subscribe((res: any) => {
      if (res.code === 0) {
        this.templatePreviewFileId = res.data;
      } else {
        this.msg.error(res.message);
        this.loading = false;
      }
    });
  }

  // 新增提交
  Submission() {
    // console.log(this.form.get('templateName').value);

    if (this.form.get('templateName').value === null || this.form.get('templateName').value === '') {
      this.msg.error('请填写企业模板名称');
      return;
    }
    if (this.payCardId === '') {
      this.msg.error('请先上传模板');
      return;
    }
    const ids = this.message.loading('正在提交...', { nzDuration: 0 }).messageId;
    this.http.post(this.templateUrl + 'service/training/hrm', {
      enterpriseGuid: this.tokenService.get().guid,
      enterpriseId: this.tokenService.get().guid,
      sysTemplateId: this.contentData.guid,
      templateFileId: this.payCardId,
      templateName: this.form.get('templateName').value,
      templatePreviewFileId: this.templatePreviewFileId,
      userId: this.userID,
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.msg.success('新增成功');
        this.router.navigate(['/blockchain/certificate/template']);
      } else {
        this.msg.error(res.message);
        this.loading = false;
      }
      this.message.remove(ids);
    });
  }
  // 获取上传的模板地址
  getimgUrl() {
    this.http.get(this.templateUrl + 'service/training/hrm', {
      params: {
        enterpriseGuid: this.tokenService.get().guid,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        // console.log(res);
      } else {
        this.msg.error(res.message);
        this.loading = false;
      }
    });
  }

  // 下载默认系统模板
  dow() {
    location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + this.sysTemplateFileId;
  }

  downloadFile(filename, content) {
    const base64Img = content;
    const oA = document.createElement('a');
    oA.href = base64Img;
    oA.download = filename;
    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    oA.dispatchEvent(event);
  }

  erweima() { // 生成二维码
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      margin: 1,
      rendererOpts: {
        quality: 0.3,
      }
    };

    QRCode.toDataURL(this.qrCode, opts, function (err, url) {

      if (err) {
        throw err;
      }
      // console.log(url);
      const img = document.getElementById('image');
      img['src'] = url;
    });

  }

  saveImgLocal() {
    this.downloadFile('导出图片', this.canvasImg);
  }

}
