import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService  } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from '../service/group.service';
import { LalustSelectPersonComponent } from '../../../../custom/lalust-select-person/lalust-select-person.component';

@Component({
  selector: 'countlist',
  templateUrl: './countlist.component.html',
  styleUrls: ['./countlist.component.less']
})
export class CountlistComponent implements OnInit {

  constructor(private fb: FormBuilder, 
    private groupService: GroupService, 
    private nzModalService: NzModalService,
    public msg: NzMessageService) {}

  @ViewChild(LalustSelectPersonComponent) 
  lalustSelectPersonComponent: LalustSelectPersonComponent;

  // filter property
  public serachType = 0;
  public key = '';
  public queryParams: any = {
    pageIndex: 1,
    pageSize: 20,
    totals: 0,
    query: this.key
  };

  // table list property
  public dataSet = [];
  public loading = false;

  // modal property
  isVisible = false;
  isVisibleManager = false;
  

  // form property
  form: FormGroup;

  public dataList: any[] = [];

  
  public data: any[] = [];

  // hidden switch
  public hiddenSwitch = true;
  public hiddenSwitchType = 1;
  
  // select people 
  public sourceSelectPeople = [];
  public sourceSelectPeopleDispley = [];
  public sourceSelectPeopleString = '';
  // select manager 
  public sourceSelectManager = []; 
  public sourceSelectManagerDispaly = [];
  public sourceSelectManagerString = '';

  // view model
  public viewModel = {
    guid: '',
    enterpriseId: '',
    name: '',
    userIds: '',
    mgrUserId: '',
    workdayId: undefined,
    classesid: undefined,
    siteId: undefined
  };
  
  public errorInfo: any = {
    userIds: false,
    mgrUserId: false,
    workdayId: false,
    classesid: false,
    siteId: false
  };

  // api source
  public sourceWorkDay = [];
  public sourceClass = [];
  public sourceAddress = [];

  // clockin people
  public clockinPeople = {};
  public joinAttendance = [];

  /*
  * 搜索框
  * */
  showSerach() {
    this.serachType = 1;
  }


  getData(): void {
    this.groupService.getData(this.queryParams)
    .subscribe((response: any) => {
      if (response.code === 0) {
        this.queryParams.totals = response.total;
        const weekArray = ['日', '一', '二', '三', '四', '五', '六'];
        response.data.forEach(ele => {
          const _rule = {
            work: '',
            rest: ''
          };
          const work = [], rest = [];
          // string to array
          const ___rule___ = JSON.parse(ele.hrmWorkday.rule);
          if (___rule___.forEach) {
            ___rule___.forEach(v => {
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
        if (!this.key) {
          this.serachType = 0;
        }
      }
    });
  }

  enterEvent(): void {
    this.refreshNzTable();
  }

/**
   * page index change event.
   * @param pageIndex page index
   */
  pageChange(pageIndex: number): void {
    if (pageIndex === 0) {
      return;
    }
    this.queryParams.pageIndex = pageIndex;
    this.refreshNzTable();
  }

  /**
   * refresh table data.
   */
  refreshNzTable(): void {
    this.loading = true;
    this.queryParams.query = this.key;
    this.getData();
  }


  /**
   * open modal of add function or update function.
   * @param type 1 add, 2 update
   */
  openModal(type: number, model: any): void {
    this.hiddenSwitchType = type;
    // add
    if (type === 1) {
      this.initOpenAddModel();
    }
    // update
    if (type === 2) {
      this.initOpenUpdateModel(model);
    }
    // this.isVisible = true;
    this.hiddenSwitch = false;
    this.initClockinPeople();
  }

  initOpenAddModel(): void {
    this.form.reset();

    this.errorInfo.userIds = false;
    this.errorInfo.mgrUserId = false;
    this.errorInfo.workdayId = false;
    this.errorInfo.classesid = false;
    this.errorInfo.siteId = false;

    this.viewModel.guid = '';
    this.viewModel.enterpriseId = '';
    this.viewModel.name = '';
    this.viewModel.userIds = '';
    this.viewModel.mgrUserId = '';
    this.viewModel.workdayId = undefined;
    this.viewModel.classesid = undefined;
    this.viewModel.siteId = undefined;

    // clean select
    this.sourceSelectPeopleDispley = [];
    this.sourceSelectManagerDispaly = [];

    this.joinAttendance = [];
  }

  initOpenUpdateModel(model: any): void {
    this.viewModel.guid = model.guid;
    this.viewModel.enterpriseId = model.enterpsiseId;
    this.viewModel.name = model.name;
    const v = [];
    if (model.hrmClockinUsers) {
      model.hrmClockinUsers.forEach(element => {
        v.push(element.userId);
      });
    }
    this.viewModel.userIds = v.join(',');
    this.viewModel.mgrUserId = model.mgrUserId;
    this.viewModel.workdayId = model.workdayId;
    this.viewModel.classesid = model.classesId;
    this.viewModel.siteId = model.siteId;

    this.errorInfo.userIds = this.viewModel.userIds ? false : true;
    this.errorInfo.mgrUserId = this.viewModel.mgrUserId ? false : true;
    this.errorInfo.workdayId = this.viewModel.workdayId ? false : true;
    this.errorInfo.classesid = this.viewModel.classesid ? false : true;
    this.errorInfo.siteId = this.viewModel.siteId ? false : true;

    // select people string and select dept string
    this.sourceSelectPeopleString = v.join(',');
    this.sourceSelectManagerString = model.mgrUserId;

    // update front page
    this.form.value.workday = model.workdayId;
    

    // fill person and fill manager
    this.sourceSelectPeopleDispley = [];
    this.sourceSelectManagerDispaly = [];
    if (model.hrmClockinUsers.length > 0) {
      model.hrmClockinUsers.forEach(element => {
        this.sourceSelectPeopleDispley.push({
          guid: element.userId,
          name: element.userName
        });
      });
    }
    if (model.mgrUserId && model.mgrUserName) {
      this.sourceSelectManagerDispaly.push({
        guid: model.mgrUserId,
        name: model.mgrUserName
      });
    }

    this.joinAttendance = v;

  }

  cancelSave(): void {
    this.hiddenSwitch = true;
  }

  saveGroup(): void {
    // validator
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


    // validate people and manager
    // validate select of three
    this.errorInfo.userIds = this.sourceSelectPeopleString ? false : true;
    this.errorInfo.mgrUserId = this.sourceSelectManagerString ? false : true;
    this.errorInfo.workdayId = this.viewModel.workdayId ? false : true;
    this.errorInfo.classesid = this.viewModel.classesid ? false : true;
    this.errorInfo.siteId = this.viewModel.siteId ? false : true;

    if (this.errorInfo.userIds
      || this.errorInfo.mgrUserId
      || this.errorInfo.workdayId
      || this.errorInfo.classesid
      || this.errorInfo.siteId) {
      finalResult = false;
    }

    if (!finalResult) {
      this.msg.error('验证不通过,请仔细检查.');
      return;
    }

    this.viewModel.userIds = this.sourceSelectPeopleString;
    this.viewModel.mgrUserId = this.sourceSelectManagerString;

    if (this.hiddenSwitchType === 1) {
      this.groupService.addGroup(this.viewModel)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.hiddenSwitch = true;
          this.refreshNzTable();
          this.initClockinPeople();
        } else {
          this.msg.error(res.message);
        }
      });
    }
    if (this.hiddenSwitchType === 2) {
      this.groupService.updateGroup(this.viewModel)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.hiddenSwitch = true;
          this.refreshNzTable();
          this.initClockinPeople();
        } else {
          this.msg.error(res.message);
        }
      });
    }
  }

  openAttendancePeople() {
    this.isVisible = true;
    this.lalustSelectPersonComponent.init();
  }

  openAttendanceManager() {
    this.isVisibleManager = true;
  }

  

  /**
   * delete current row...
   * @param guid groupid
   * @param name group name
   */
  deleteGroup(guid: string, name: string): void {
    this.nzModalService.confirm({
      nzTitle: '删除考勤组',
      nzContent: `<span style="color: red !important;">确定删除 <strong>${ name }</strong> 吗?</span>`,
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.groupService.deleteGroupById(guid)
        .subscribe((res) => {
          this.refreshNzTable();
          this.initClockinPeople();
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => {}
    });
  }


  /******
   * 
   * 
   * select people
   * 
   * 
   */
  changeSelectPoeple(value): void {
    this.sourceSelectPeople = value;
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


  handleCancelSelectUser(): void {
    this.isVisible = false;
  }

  handleOkSelectUser(): void {
    // this.sourceSelectPeopleDispley = JSON.parse(JSON.stringify(this.sourceSelectPeople));

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

  /******
   * 
   * 
   * select manager
   * 
   * 
   */
  changeSelectManager(value): void {
    this.sourceSelectManager = value;
  }

  removeSelectManager(guid): void {
    // find index
    let index = -1;
    this.sourceSelectManagerDispaly.forEach((element, i) => {
      if (guid === element.guid) {
        index = i;
      }
    });
    // remove
    this.sourceSelectManagerDispaly.splice(index, 1);
    this.toRealSelectManager();
    this.isVisibleManager = false;
  }


  handleCancelSelectManager(): void {
    this.isVisibleManager = false;
  }

  handleOkSelectManager(): void {
    this.sourceSelectManagerDispaly = JSON.parse(JSON.stringify(this.sourceSelectManager));
    this.toRealSelectManager();
    this.isVisibleManager = false;
  }


  toRealSelectPeople(): void {
    const v = [];
    this.sourceSelectPeopleDispley.forEach(element => {
      // v.push(element.userGuid || element.guid);
      v.push(element.guid || element.userGuid);
    });
    this.sourceSelectPeopleString = v.join(',');
    this.errorInfo.userIds = this.sourceSelectPeopleString ? false : true;
    this.joinAttendance = v;
  }

  toRealSelectManager(): void {
    const v = [];
    this.sourceSelectManagerDispaly.forEach(element => {
      // v.push(element.userGuid || element.guid);
      v.push(element.guid || element.userGuid);
    });
    this.sourceSelectManagerString = v.join(',');
    this.errorInfo.mgrUserId = this.sourceSelectManagerString ? false : true;
  }

  selectChangeWorkday(v: any): void {
    this.errorInfo.workdayId = v ? false : true;
  }

  selectChangeClasses(v: any): void {
    this.errorInfo.classesid = v ? false : true;
  }

  selectChangeSite(v: any): void {
    this.errorInfo.siteId = v ? false : true;
  }



  initSelectDataFromOtherAPI(): void {
    this.groupService.getWorkDayData()
    .subscribe((res: any) => {
      if (res.code === 0) {
        this.sourceWorkDay = res.data;
      }
    });
    this.groupService.getShiftData()
    .subscribe((res: any) => {
      if (res.code === 0) {
        this.sourceClass = res.data;
      }
    });
    this.groupService.getWorkAddressData()
    .subscribe((res: any) => {
      if (res.code === 0) {
        this.sourceAddress = res.data;
      }
    });
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
    // init table data.
    this.refreshNzTable();
    this.form = this.fb.group({
      groupname: [ '', [ Validators.required ] ]
    });
    this.initSelectDataFromOtherAPI();
    this.initClockinPeople();
  }


}
