import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { HttpClient } from '@angular/common/http';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { LalustSelectPersonSingleComponent } from '../../../custom/lalust-select-person-single/lalust-select-person-single.component';
import { lastDayOfISOWeek } from 'date-fns';


@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  httpUrl = environment.SERVER_URL + environment.CONTRACT_URL;
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
  pictureId = '';
  previewVisible = false;
  nzMultiplea = true;
  numberss = 1;
  userID = '';
  uploaderGradUrl = '';
  imageUrl = '';
  storageType = '';
  validateForm: FormGroup;
  carsystemlist = [];
  pleplolist = [];
  guid = '';
  data: any = {
    seriesName: '',
    typeName: '',
    imageUrl: '',
    brandId: '',
  };
  pageNum: any = 1;
  pageSize: any = 200;
  startTime = '';
  endTime = '';
  userId = '';
  enterpriseKey = '';
  userKey = '';
  selectSignedPerson: any;
  signedPerson: any; // 签订人
  signedPersonId: any = '';
  signedPrinter: any; // 用印人
  signedPrinterId: any = '';
  signedAuditor: any; // 审核人
  signedAuditorId: any = '';
  operationBtn: any;
  isVisibleManager = false;
  isVisible = false;
  isVisibleAuditor = false;
  isVisibleOuter = false; // 外部人员
  outerPersonName = ''; // 外部姓名
  outerPerson: any = []; // 外部人员手机号
  outerPersonPhone: ''; // 当前外部人员手机号

  isVisibleOuterSign = false; // 外部签订人员
  outerPersonSignName = ''; // 外部签订姓名
  outerPersonSignPhone: ''; // 当前外部签订人员手机号
  selectedPersonSign = {
    name: '',
    phone: ''
  };

  isVisibleOuterPrint = false; // 外部用印人员
  outerPersonPrintPhone: ''; // 外部用印人员手机号
  selectedPersonPrint = {
    name: '',
    phone: ''
  };

  mName: any = [];
  copyUserLists: any = [];
  sendPersonAuditor = [];
  auditorIdsLists = [];
  sendPerson = [];
  orderPerson = []; // 顺序审核人数组
  today = new Date();
  constructor(
    private http: HttpClient, private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router, private route: ActivatedRoute,
    private nzMessage: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) { }

  @ViewChild(LalustSelectPersonSingleComponent)
  lalustSelectPersonSingleComponent: LalustSelectPersonSingleComponent;

  ngOnInit() {
    console.log(this.today);

    this.getData();
    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.getPlople();
    this.uploaderGradUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.userId + '&escrowType=CONTRACT_SIGN' + '&fileNum=0';
    // this.getpeople();
    this.validateForm = this.fb.group({
      userId: [''],
      printerId: [''],
      auditorId: [''],
      day: [null, [Validators.required, Validators.pattern(/^[0-9]*[1-9][0-9]*$/)]],
      remark: [''],
      typeId: ['', [Validators.required]],
      quitTime: ['', [Validators.required]],
      enterpriseKey: ['', [Validators.required]],
      userKey: ['', [Validators.required]]
    });
    // this.route.params.subscribe((params: Params) => {
    //   this.guid = params['guid'];
    // });
    // if (this.guid !== '' && this.guid !== undefined) {
    //   this.getBox();
    // }
  }


  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  // 上傳的監控
  handleChange(info: { file: UploadFile }, type: any): void {
    // console.log(info);
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      console.log(info);

      // Get this url from response in real world.
      this.nzMessage.success('上传成功');
      if (type === 0) {
        this.imageUrl = this.fileList[type][0].response.extraData.fileUrl || '';
        this.pictureId = info.file.response.data;
        const obj1 = {
          uid: -1,
          name: '合同文件.png',
          status: 'done',
          url: './assets/img/template/other.png',
        };
        if (this.imageUrl !== '') {
          this.fileList[0][0] = obj1;
        }
      }
    } else if (info.file.status === 'removed') {
      if (type === 0) {
        this.imageUrl = '';
        this.pictureId = '';
        // this.delFileIds.push(info.file.response.data);
      }
    }
  }
  onChange(result: Date): void {
    this.startTime = result[0];
    this.endTime = result[1];
    // this.getData();
    // console.log(result[0]);
    // console.log(result[1]);
  }

  userBtn(v, btn) {
    this.operationBtn = btn;
    if (btn === 1) {
      if (v !== undefined) {
        const vtype = 1;
        this.lalustSelectPersonSingleComponent.reset(this.signedPersonId, vtype);
      } else {
        this.lalustSelectPersonSingleComponent.reset(this.signedPersonId, 0);
      }
    } else if (btn === 2) {
      if (v !== undefined) {
        const vtype = 1;
        this.lalustSelectPersonSingleComponent.reset(this.signedPrinterId, vtype);
      } else {
        this.lalustSelectPersonSingleComponent.reset(this.signedPrinterId, 0);
      }
    } else {
      if (v !== undefined) {
        const vtype = 1;
        this.lalustSelectPersonSingleComponent.reset(this.signedAuditorId, vtype);
      } else {
        this.lalustSelectPersonSingleComponent.reset(this.signedAuditorId, 0);
      }
    }
    this.isVisibleManager = true;
  }
  handleCancelSelectManager() {
    this.isVisibleManager = false;
    this.selectSignedPerson = [];
    if (this.operationBtn === 1) {
      if (this.signedPerson === '') {
        this.signedPersonId = '';
      }
    } else if (this.operationBtn === 2) {
      if (this.signedPrinter === '') {
        this.signedPrinterId = '';
      }
    } else {
      if (this.signedAuditor === '') {
        this.signedAuditorId = '';
      }
    }
  }
  handleOkSelectManager() {
    if (this.selectSignedPerson !== undefined) {
      if (this.operationBtn === 1) {
        this.signedPersonId = this.selectSignedPerson[0].userGuid;
        this.signedPerson = this.selectSignedPerson[0].name;
        this.selectedPersonSign.name = '';
        this.selectedPersonSign.phone = '';
      } else if (this.operationBtn === 2) {
        this.signedPrinterId = this.selectSignedPerson[0].userGuid;
        this.signedPrinter = this.selectSignedPerson[0].name;
      } else {
        this.signedAuditorId = this.selectSignedPerson[0].userGuid;
        this.signedAuditor = this.selectSignedPerson[0].name;
      }

    }
    this.isVisibleManager = false;
  }
  changeSelectManager(value) {
    console.log(value);

    this.selectSignedPerson = value;
    console.log(value);
  }
  getData() { // h获取合同类型
    this.http.get(environment.SERVER_URL + environment.COMMONS_URL + 'service/dictionary/type', {
      params: {
        dictType: 'CONTRACT_TYPE',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
    })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.carsystemlist = res.data;
        } else {
          this.nzMessage.error(res.message);
          this.loading = false;
        }
      });
  }
  getPlople() { // h获取人员信息
    this.http.get(environment.SERVER_URL + environment.ENTERPRISE_URL + 'service/employee/enterprise?' + 'enterpriseGuid=' + this.tokenService.get().guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.pleplolist = res.data;
        } else {
          this.nzMessage.error(res.message);
          this.loading = false;
        }
      });
  }


  // 多个审核人

  showModalAuditor(): void {
    this.isVisibleAuditor = true;
  }
  // 修改审批人
  changeAuditor(id): void {
    console.log(id);
    this.isVisibleAuditor = true;
  }
  // 删除审批人
  removeAuditor(id, n): void {
    console.log(n);
    this.removeOuterPerson(id);
    this.orderPerson.splice(n, 1);
  }

  changeSelectPoepleAuditor(event): void {
    console.log(event);
    this.sendPersonAuditor = event;
    // console.log(this.sendPerson);
    this.auditorIdsLists = [];
  }

  handleOkAuditor(): void {
    // 添加到顺序审批人列表
    let flg = true;
    this.sendPersonAuditor.forEach(item => {
      this.auditorIdsLists.push(item.userGuid);
      this.orderPerson.forEach(element => {
        if (element.userGuid === item.userGuid) {
          this.nzMessage.error('审批人重复');
          flg = false;
          return;
        }
      });
      if (flg && item.userGuid) {
        this.orderPerson.push(item);
      }
    });
    this.isVisibleAuditor = false;
  }

  handleCancelAuditor(): void {
    this.isVisibleAuditor = false;
  }

  // 多个抄送人

  showModal(): void {
    this.isVisible = true;
  }
  // 外部审核人员
  showOuterModal(): void {
    this.isVisibleOuter = true;
  }
  handleCancelOuter(): void {
    this.isVisibleOuter = false;
    this.outerPersonName = '';
    this.outerPersonPhone = '';
  }
  handleOkOuter(): void {
    this.isVisibleOuter = false;
    const obj = {
      name: this.outerPersonPhone,
      userGuid: this.outerPersonPhone
    };
    if (this.outerPersonPhone && !(/^1\d{10}$/.test(this.outerPersonPhone))) {
      this.nzMessage.error('手机号码有误，请重新输入');
      return;
    }
    let flg = true;
    this.outerPerson.forEach(element => {
      if (element.userGuid === this.outerPersonPhone) {
        this.nzMessage.error('外部审批人手机号重复');
        flg = false;
        return;
      }
    });
    if (flg && obj.userGuid) {
      this.outerPerson.push(obj);
      this.orderPerson.push(obj);
    }
    this.outerPersonName = '';
    this.outerPersonPhone = '';
  }
  // 移除外部
  removeOuterPerson(phone): void {
    this.outerPerson.forEach((element, index) => {
      if (element.userGuid === phone) {
        this.outerPerson.splice(index, 1);
        return;
      }
    });
  }
  // 外部签订人员
  showOuterSignModal(): void {
    this.isVisibleOuterSign = true;
  }
  handleCancelOuterSign(): void {
    this.isVisibleOuterSign = false;
    // this.outerPersonSignName = '';
    this.outerPersonSignPhone = '';
  }
  handleOkOuterSign(): void {
    this.isVisibleOuterSign = false;
    const obj = {
      name: this.outerPersonSignName,
      phone: this.outerPersonSignPhone
    };
    if (this.outerPersonSignPhone && !(/^1\d{10}$/.test(this.outerPersonSignPhone))) {
      this.nzMessage.error('手机号码有误，请重新输入');
      return;
    }
    this.selectedPersonSign = obj;
    this.signedPersonId = this.outerPersonSignPhone;
    this.signedPerson = this.outerPersonSignPhone;
    this.outerPersonSignPhone = '';
  }

  // 外部用印人员
  showOuterPrintModal(): void {
    this.isVisibleOuterPrint = true;
  }
  handleCancelOuterPrint(): void {
    this.isVisibleOuterPrint = false;
    this.outerPersonPrintPhone = '';
  }
  handleOkOuterPrint(): void {
    this.isVisibleOuterPrint = false;
    const obj = {
      name: '',
      phone: this.outerPersonPrintPhone
    };
    if (this.outerPersonPrintPhone && !(/^1\d{10}$/.test(this.outerPersonPrintPhone))) {
      this.nzMessage.error('手机号码有误，请重新输入');
      return;
    }
    this.selectedPersonPrint = obj;
    this.signedPrinterId = this.outerPersonPrintPhone;
    this.signedPrinter = this.outerPersonPrintPhone;
    this.outerPersonPrintPhone = '';
  }


  changeSelectPoeple(event): void {
    this.sendPerson = event;
    this.copyUserLists = [];
    this.sendPerson.forEach(item => {
      this.copyUserLists.push(item.userGuid);
    });

  }

  handleOk(): void {
    console.log(this.copyUserLists);
    this.isVisible = false;
  }

  handleCancel(): void {

    this.isVisible = false;
  }
  disabledDate = (current: Date): boolean => {
    const d = new Date();
    const dd = d.getFullYear();
    const ddd = dd + 100;
    const nd = d.setFullYear(ddd);
    this.today = new Date(nd);
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  }
  submit() {
    if (this.signedPersonId === '') {
      this.nzMessage.error('请选择签订人');
      return;
    }
    if (this.signedPrinterId === '') {
      this.nzMessage.error('请选择用印人');
      return;
    }
    if (this.auditorIdsLists.length <= 0 && this.outerPerson.length <= 0) {
      this.nzMessage.error('请选择审核人');
      return;
    }
    let allPerson = [];
    const arr = [];
    if (this.outerPerson.length > 0) {
      this.outerPerson.forEach(element => {
        arr.push(element.userGuid + '');
      });
    }
    allPerson = this.auditorIdsLists.concat(arr);
    
    // 修改顺序审批人
    const arrOrderPerson = [];
    this.orderPerson.forEach(element => {
      arrOrderPerson.push(element.userGuid + '');
    });

    if (this.imageUrl === '') {
      this.nzMessage.error('请上传合同文件');
      return;
    }
    this.loading = true;
    const obj = JSON.parse(JSON.stringify(this.validateForm.value));
    obj['fileUrl'] = this.imageUrl;
    obj['hrUserId'] = this.userId;
    obj['userId'] = this.signedPersonId + '';
    obj['printerId'] = this.signedPrinterId + '';
    obj['pictureId'] = this.pictureId;
    obj['auditorIds'] = arrOrderPerson;
    obj['carboncopyId'] = this.copyUserLists;
    obj['enterpriseId'] = this.tokenService.get().guid;
    obj['contractLifeStart'] = this.dateTransformToString(this.startTime);
    obj['contractLifeEnd'] = this.dateTransformToString(this.endTime);
    delete obj.quitTime;
    delete obj.auditorId;
    this.http.post(this.httpUrl + 'service/contract/sign', obj).subscribe((value: any) => {
      if (value.code === 0) {
        this.nzMessage.success('新增成功');
        this.router.navigate(['/contract/list']);
      } else {
        this.nzMessage.error(value.message);
      }
      this.loading = false;
    });
  }
  contractTypeChange(e) {
    this.http.get(this.httpUrl + 'service/contract/key/getByEnterpriseIdAndTypeId', {
      params: {
        typeId: e,
        enterpriseId: this.tokenService.get().guid,
      }
    })
      .subscribe((res: any) => {
        if (res.code === 0) {
          if (res.data !== {}) {
            this.enterpriseKey = res.data.enterpriseKey;
            this.userKey = res.data.userKey;
          } else {
            this.enterpriseKey = '';
            this.userKey = '';
          }

        } else {
          this.nzMessage.error(res.message);
          this.loading = false;
        }
      });

  }
  cancel() {
    this.router.navigate(['/contract/list']);
  }
  // setFormValue() {
  //   this.validateForm.setValue({
  //     seriesName: this.data.seriesName,
  //     brandId: this.data.brandId,
  //   });
  // }
  /**
   * 将时间转换成yyyyMMddHHmmss类型的字符串
   * @param inDate 
   */
  dateTransformToString(inDate: Date | string | any, format?: string): string {
    let year = null,
      month = null,
      day = null,
      hour = null,
      minute = null,
      sec = null,
      date = null;

    if (inDate instanceof Date) {
      date = inDate;
    } else if (inDate === '' || inDate === null || inDate === undefined) {
      return '';
    } else {
      try {
        date = new Date(inDate);
      } catch (error) {
        return '';
      }
    }
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
    minute = date.getMinutes();
    sec = date.getSeconds();
    let returnStr = null;
    if (format === 'yyyyMM') {
      returnStr = '' + year + (month < 10 ? '0' + month : month);
    } else {
      returnStr = '' + year + (month < 10 ? '0' + month : month) +
        (day < 10 ? '0' + day : day) +
        (hour < 10 ? '0' + hour : hour) +
        (minute < 10 ? '0' + minute : minute) +
        (sec < 10 ? '0' + sec : sec);
    }
    return returnStr;
  }
}
