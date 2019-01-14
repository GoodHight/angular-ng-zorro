import { element } from 'protractor';

import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile , NzModalService} from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { WorkdayService } from './service/workday.service';

@Component({
  selector: 'workday-setting',
  templateUrl: './workday-setting.component.html',
  styleUrls: ['./workday-setting.component.less']
})
export class WorkdaySettingComponent implements OnInit {

  switchValue = false;
  checkOptionsWorkday = [
    { label: '周一', value: '1', checked: false },
    { label: '周二', value: '2', checked: false },
    { label: '周三', value: '3', checked: false },
    { label: '周四', value: '4', checked: false },
    { label: '周五', value: '5', checked: false },
    { label: '周六', value: '6', checked: false },
    { label: '周日', value: '0', checked: false },
  ];
  public tabSelectIndex = 2;
  guid: '';
  tabs = [];
  constructor(
    private workdayService: WorkdayService,
    private nzModalService: NzModalService,
    private fb: FormBuilder, 
    private msg: NzMessageService, 
    private router: Router, 
    private route: ActivatedRoute,
    public scroll: ScrollService, 
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }




// table list property
public dataSet = [];
public loading = false;


// add or update modal 
form: FormGroup;
isVisible = false;
public modalTitle = '新增工作日设置';
public selectModalType = 1;

public viewModel = {
  guid: '',
  enterpriseId: '',
  name: '',
  rule: [],
  holidayRestFlag: false
};

checkedHoliday: any = false;

/**
 * refresh table data.
 */
refreshNzTable(): void {
  this.loading = true;
  this.getData();
}


getData(): void {
  this.workdayService.getData()
  .subscribe((response: any) => {
    if (response.code === 0) {
      const weekArray = ['日', '一', '二', '三', '四', '五', '六'];
      response.data.forEach(ele => {
        const _rule = {
          work: '',
          rest: ''
        };
        const work = [], rest = [];
        if (ele.rule.forEach) {
          ele.rule.forEach(v => {
            if (v.piychOn === 0) {
              // work
              work.push(weekArray[v.weekday]);
            } else {
              // rest
              rest.push(weekArray[v.weekday]);
            }
          });
        }
        _rule.work = work.join(',');
        _rule.rest = rest.join(',');
        ele._rule = _rule;
      });
      this.dataSet = response.data;
      this.loading = false;
    } else {
      this.msg.error('获取工作日数据失败.');
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
    nzTitle: '删除工作日',
    nzContent: `<span style="color: red !important;">确定删除 <strong>${ name }</strong> 吗?</span>`,
    nzOkText: '删除',
    nzOkType: 'danger',
    nzOnOk: () => {
      this.workdayService.deleteAddressById(guid)
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
      this.modalTitle = '新增工作日设置';
      this.initOpenModalOfAdd();
    }
    // update
    if (type === 2) {
      this.modalTitle = '编辑工作日设置';
      this.initOpenModalOfUpdate(model);
    }
    this.isVisible = true;
  }

  checkboxChange(value: any): void {
    const rule = [];
    value.forEach( ele => {
      rule.push({
        piychOn: ele.checked ? 0 : 1,
        weekday: parseInt(ele.value, 10)
      });
    });
    // move to first one
    const last = rule.pop();
    rule.splice(0, 0, last);
    this.viewModel.rule = rule;
  }

  initOpenModalOfAdd(): void {
    this.form.reset();
    this.viewModel.name = '';
    this.initRule();
  }
  initOpenModalOfUpdate(model: any): void {
    this.viewModel.name = model.name;
    this.viewModel.enterpriseId = model.enterpriseId;
    this.viewModel.guid = model.guid;
    this.viewModel.rule = model.rule;
    this.checkedHoliday = model.holidayRestFlag === 0 ? true : false;
    this.convertCheckOptionsWorkday();
  }
  initRule(): void {
    // false 
    // rule
    const rule = [];
    this.checkOptionsWorkday.forEach( ele => {
      // { label: '周一', value: '1', checked: false }
      if (ele) {
        ele.checked = false;
      }
      rule.push({
        piychOn: ele.checked ? 0 : 1,
        weekday: parseInt(ele.value, 10)
      });
    });
    this.viewModel.rule = rule;
  }
  convertCheckOptionsWorkday(): void {
    // { label: '周一', value: '1', checked: false },
    // 1 2 3 4 5 6 0
    if (this.viewModel.rule.forEach) {
      this.viewModel.rule.forEach(ele => {
        const index = ele.weekday === 0 ? 6 : ele.weekday - 1;
        if (this.checkOptionsWorkday[index]) {
          this.checkOptionsWorkday[index].checked = ele.piychOn === 0 ? true : false;
        }
      });
    }
  }

  handleOk(): void {
    for (const i in this.form.controls) {
      this.form.controls[ i ].markAsDirty();
      this.form.controls[ i ].updateValueAndValidity();
    }
    // status === 'VALID' or 'INVALID'
    // valid === true or false
    if (this.form.status !== 'VALID' || !this.form.valid) {
      this.msg.error('验证不通过,请仔细检查.');
      return;
    }
    this.isVisible = false;
    // name 
    this.viewModel.name = this.form.value.name;
    this.viewModel.holidayRestFlag = this.checkedHoliday;
    if (this.selectModalType === 1) {
      // add
      this.workdayService.addGroup(this.viewModel)
      .subscribe(res => {
        this.refreshNzTable();
      });
    } else {
      // update
      this.workdayService.updateGroup(this.viewModel)
      .subscribe(res => {
        this.refreshNzTable();
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

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
      name: ['', [Validators.required]]
    });
  }

}
