import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ShiftService } from './service/shift.service';

@Component({
  selector: 'shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.less']
})
export class ShiftComponent implements OnInit {
  switchValue = false;
  isOkLoading = false;
  public tabSelectIndex = 3;
  guid: '';
  tabs = [];
  constructor(
    private shiftService: ShiftService,
    private nzModalService: NzModalService,
    private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }


// table list property
public dataSet = [];
public loading = false;


// add or update modal 
form: FormGroup;
isVisible = false;
public modalTitle = '新增班次设置';
public selectModalType = 1;

public viewModel = {
  guid: '',
  enterpriseId: '',
  name: '',
  workST: undefined,
  selectedValueWork: '1',
  workET: undefined,
  clockST: undefined,
  selectedValueClock: '1',
  clockET: undefined,
  switchValueLate: false,
  lateTime: undefined,
  switchValueEarly: false,
  earlyTime: undefined
};

// time error info 
public timeErrorInfo = {
  workTime: false,
  clockTime: false
};

// switch change error
public switchShowLateError = false;
public switchShowEarlyError = false;

/**
 * refresh table data.
 */
refreshNzTable(): void {
  this.loading = true;
  this.getData();
}

getData(): void {
  this.shiftService.getData()
  .subscribe((response: any) => {
    if (response.code === 0) {
      this.dataSet = response.data;
      this.loading = false;
    } else {
      this.msg.error('获取班次数据失败.');
    }
  });
}

/**
 * delete current row...
 * @param guid groupid
 * @param name group name
 */
deleteGroup(guid: string, name: string): void {
  this.nzModalService.confirm({
    nzTitle: '删除班次',
    nzContent: `<span style="color: red !important;">确定删除 <strong>${ name }</strong> 吗?</span>`,
    nzOkText: '删除',
    nzOkType: 'danger',
    nzOnOk: () => {
      this.shiftService.deleteShiftById(guid)
      .subscribe((res) => {
        this.refreshNzTable();
      });
    },
    nzCancelText: '取消',
    nzOnCancel: () => {}
  });
}


  /**
   * open modal of add function or update function.
   * @param type 1 add, 2 update
   * @param model
   */
  openModal(type: number, model: any): void {
    this.selectModalType = type;
    // add
    if (type === 1) {
      this.modalTitle = '新增班次';
      this.initOpenModalOfAdd();
    }
    // update
    if (type === 2) {
      this.modalTitle = '编辑班次';
      this.initOpenModalOfUpdate(model);
    }
    this.isVisible = true;
  }

  initOpenModalOfAdd(): void {
    this.form.reset();
    this.viewModel.guid = '';
    this.viewModel.enterpriseId = '';
    this.viewModel.name = '';
    this.viewModel.workST = undefined;
    this.viewModel.selectedValueWork = '1';
    this.viewModel.workET = undefined;
    this.viewModel.clockST = undefined;
    this.viewModel.selectedValueClock = '1';
    this.viewModel.clockET = undefined;
    this.viewModel.switchValueLate = false;
    this.viewModel.lateTime = undefined;
    this.viewModel.switchValueEarly = false;
    this.viewModel.earlyTime = undefined;

    this.switchShowLateError = false;
    this.switchShowEarlyError = false;
  }
  initOpenModalOfUpdate(model: any): void {

    
    this.viewModel.name = model.name;
    this.viewModel.enterpriseId = model.enterpriseId;
    this.viewModel.guid = model.guid;

    this.viewModel.workST = this.convertToDate(model.startWorkTime);
    this.viewModel.selectedValueWork = model.workOnDay + '';
    this.viewModel.workET = this.convertToDate(model.endWorkTime);
    this.viewModel.clockST = this.convertToDate(model.clockinStartTime);
    this.viewModel.selectedValueClock = model.clockinOnDay + '';
    this.viewModel.clockET = this.convertToDate(model.clockinEndTime);
    this.viewModel.switchValueLate = model.openLate === 1 ? true : false;
    this.viewModel.lateTime = this.convertToDate(model.lateTime);
    this.viewModel.switchValueEarly = model.openEarly === 1 ? true : false;
    this.viewModel.earlyTime = this.convertToDate(model.earlyTime);

    if (model.openLate !== 1  || this.viewModel.lateTime) {
      this.switchShowLateError = false;
    } else {
      this.switchShowLateError = true;
    }
    if (model.openEarly !== 1 || this.viewModel.earlyTime) {
      this.switchShowEarlyError = false;
    } else {
      this.switchShowEarlyError = true;
    }
  }

  convertToDate(time: string): any {
    if (time) {
      const h = parseInt(time.substring(0, 2), 10);
      const m = parseInt(time.substring(2, 4), 10);
      const d = new Date(h);
      d.setHours(h);
      d.setMinutes(m);
      return d;
    } else {
      return null;
    }
  }

  handleOk(): void {
    for (const i in this.form.controls) {
      this.form.controls[ i ].markAsDirty();
      this.form.controls[ i ].updateValueAndValidity();
    }
    
    // synchronous verification
    let finalResult = true;

    // status === 'VALID' or 'INVALID'
    // valid === true or false
    if (this.form.status !== 'VALID' || !this.form.valid) {
      finalResult = false;
    }

    // validate switch time
    if (this.viewModel.switchValueLate) {
      if (!this.viewModel.lateTime) {
        this.switchShowLateError = true;
        finalResult = false;
      } else {
        this.switchShowLateError = false;
      }
    }
    if (this.viewModel.switchValueEarly) {
      if (!this.viewModel.earlyTime) {
        this.switchShowEarlyError = true;
        finalResult = false;
      } else {
        this.switchShowEarlyError = false;
      }
    }

    // time validate
    if (this.timeErrorInfo.workTime || this.timeErrorInfo.clockTime) finalResult = false;

    if (!finalResult) {
      this.msg.error('验证不通过,请仔细检查.');
      return;
    }

    this.isVisible = false;
    // name 
    this.viewModel.name = this.form.value.name;
    if (this.selectModalType === 1) {
      // add
      this.shiftService.addShift(this.viewModel)
      .subscribe(res => {
        this.refreshNzTable();
      });
    } else {
      // update
      this.shiftService.updateShift(this.viewModel)
      .subscribe(res => {
        this.refreshNzTable();
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onChangeSelectToday(type: number, value: any) {
    if (type === 1) {
      this.viewModel.selectedValueWork = value;
      this.checkTimeError(1);
    }
    if (type === 2) {
      this.viewModel.selectedValueClock = value;
      this.checkTimeError(2);
    }
  }

  /**
   *
   *  check time
   * @param {number} type 1 work time . 2 clock time
   * @memberof ShiftComponent
   */
  checkTimeError(type: number): void {
    if (type === 1) {
      const start = this.viewModel.workST;
      const end = this.viewModel.workET;
      const t = this.viewModel.selectedValueWork;
      if (!start || !end || t === '0') {
        this.timeErrorInfo.workTime = false;
        return;
      }
      if (start.getTime() && end.getTime() && t === '1') {
        if (start.getTime() > end.getTime()) {
          this.timeErrorInfo.workTime = true;
        } else {
          this.timeErrorInfo.workTime = false;
        }
      }
    }
    if (type === 2) {
      const start = this.viewModel.clockST;
      const end = this.viewModel.clockET;
      const t = this.viewModel.selectedValueClock;
      if (!start || !end || t === '0') {
        this.timeErrorInfo.clockTime = false;
        return;
      }
      if (start.getTime() && end.getTime() && t === '1') {
        if (start.getTime() > end.getTime()) {
          this.timeErrorInfo.clockTime = true;
        } else {
          this.timeErrorInfo.clockTime = false;
        }
      }
    }
  }


  onChangeTime(type: number, result: Date): void {
    if (!result) return;
    if (type === 1) {
      this.checkTimeError(1);
    }
    if (type === 2) {
      this.checkTimeError(2);
    }
  }
  
  onChange(type: number, result: Date): void {
    if (type === 1) {
      if (this.viewModel.lateTime) {
        this.switchShowLateError = false;
      } else {
        this.switchShowLateError = true;
      }
    }
    if (type === 2) {
      if (this.viewModel.earlyTime) {
        this.switchShowEarlyError = false;
      } else {
        this.switchShowEarlyError = true;
      }
    }
  }

  onChangeSwitch(type: number, value: boolean): void {
    if (type === 1) {
      if (value) {
        if (this.viewModel.lateTime) {
          this.switchShowLateError = false;
        } else {
          this.switchShowLateError = true;
        }
      } else {
        this.switchShowLateError = false;
      }
    }
    if (type === 2) {
      if (value) {
        if (this.viewModel.earlyTime) {
          this.switchShowEarlyError = false;
        } else {
          this.switchShowEarlyError = true;
        }
      } else {
        this.switchShowEarlyError = false;
      }
    }
  }


  // 路由
  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }
  ngOnInit() {
    this.refreshNzTable();
    this.route.params
      .subscribe((params: Params) => {
        // this.guid = params['guid'];
        this.tabs = [{
          key: '/attendance/setting/index',
          tab: '免考勤规则',
        },
        {
          key: '/attendance/setting/address',
          tab: '考勤地址',
        },
        {
          key: '/attendance/setting/workday',
          tab: '工作日设置',
        },
        {
          key: '/attendance/setting/shift',
          tab: '班次设置',
        }];
      });

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      workST: ['', [Validators.required]],
      workET: ['', [Validators.required]],
      clockST: ['', [Validators.required]],
      clockET: ['', [Validators.required]]
    });
  }

}
