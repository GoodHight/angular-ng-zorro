import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { RuleService } from './service/rule.service';
import { GroupService } from '../../manage/service/group.service';
import { LalustSelectPersonComponent } from '../../../../custom/lalust-select-person/lalust-select-person.component';
import { LalustSelectDeptComponent } from './../../../../custom/lalust-select-dept/lalust-select-dept.component';

@Component({
  selector: 'attendance-rules',
  templateUrl: './attendance-rules.component.html',
  styleUrls: ['./attendance-rules.component.less']
})
export class AttendanceRulesComponent implements OnInit {
  isVisible = false;
  public tabSelectIndex = 0;
  guid: '';
  tabs = [];
  constructor(
    private ruleService: RuleService,
    private groupService: GroupService,
    private fb: FormBuilder, 
    private msg: NzMessageService, 
    private router: Router, 
    private route: ActivatedRoute,
    public scroll: ScrollService) {
  }
  

  // source data
  public dataSet: any = [];

  // select people 
  public sourceSelectPeople = [];
  public sourceSelectPeopleDispley = [];
  public sourceSelectPeopleString = '';
  // select dept 
  public sourceSelectRaw = []; 
  public sourceSelectDept = [];
  public sourceSelectDeptString = '';

  @ViewChild(LalustSelectPersonComponent) 
  lalustSelectPersonComponent: LalustSelectPersonComponent;

  @ViewChild(LalustSelectDeptComponent)
  lalustSelectDeptComponent: LalustSelectDeptComponent;

   // clockin people
   public clockinPeople = {};
   public joinAttendance = [];

  /**
   * refresh table data.
   */
  refreshNzTable(): void {
    this.getData();
  }


  getData(): void {
    this.ruleService.getData()
    .subscribe((response: any) => {
      if (response.code === 0) {
        this.dataSet = response.data;
        this.initGetDate();
        this.initClockinPeople();
      }
    });
  }

  initGetDate(): void {
    const users = this.dataSet.users;
    const depts = this.dataSet.depts;
    // users
    this.sourceSelectPeople = JSON.parse(JSON.stringify(users));
    this.sourceSelectPeopleDispley = JSON.parse(JSON.stringify(users));
    this.toRealSelectPeople();
    this.isVisible = false;
    const v = [];
    this.sourceSelectPeople.forEach((ele: any) => {
      v.push(ele.guid);
    });
    this.joinAttendance = v;
    
    // depts
    this.sourceSelectRaw = JSON.parse(JSON.stringify(depts));
    this.sourceSelectDept = JSON.parse(JSON.stringify(depts));
    this.toRealSelectDept();

    this.lalustSelectDeptComponent.resetSelect();
  }

  showModal(): void {
    this.lalustSelectPersonComponent.init();
    this.isVisible = true;
  }

  changeSelectPoeple(event): void {
    this.sourceSelectPeople = event;
  }

  changeSelectDept(event): void {
    this.sourceSelectDept = event;
    this.toRealSelectDept();
  }

  removeSelectPeople(guid): void {
    // find index
    let index = -1;
    this.sourceSelectPeopleDispley.forEach((element, i) => {
      if (guid === element.guid) {
        index = i;
      }
    });
    // remove
    this.sourceSelectPeopleDispley.splice(index, 1);
    this.toRealSelectPeople();
    this.isVisible = false;
  }

  refreshRule(): void {
    this.refreshNzTable();
  }

  saveRule(): void {
    this.ruleService.addGroup({
      userIds: this.sourceSelectPeopleString,
      deptIds: this.sourceSelectDeptString
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.refreshNzTable();
        this.msg.success('保存成功');
      } else {
        this.msg.error('保存失败');
      }
      
    });
  }

  handleOk(): void {
    // this.sourceSelectPeopleDispley = this.sourceSelectPeople;
    this.sourceSelectPeopleDispley = [];
    const vv = {};
    this.sourceSelectPeopleDispley.forEach(element => {
      vv[element.guid] = element;
    });
    this.sourceSelectPeople.forEach(element => {
      vv[element.guid] = element;
    });

    for (const key in vv) {
      if (vv.hasOwnProperty(key)) {
        this.sourceSelectPeopleDispley.push(vv[key]);
      }
    }
    this.toRealSelectPeople();
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  toRealSelectPeople(): void {
    const v = [];
    this.sourceSelectPeopleDispley.forEach(element => {
      // v.push(element.userGuid || element.guid);
      v.push(element.guid || element.userGuid);
    });
    this.sourceSelectPeopleString = v.join(',');
    this.joinAttendance = v;
  }

  toRealSelectDept(): void {
    const v = [];
    this.sourceSelectDept.forEach(element => {
      v.push(element.guid);
    });
    this.sourceSelectDeptString = v.join(',');
  }

  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }

  initClockinPeople(): void {
    this.groupService.getClockinPeople()
    .subscribe((res: any) => {
      if (res.code === 0) {
        this.clockinPeople = res.data;
      }
    });
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
  }

}
