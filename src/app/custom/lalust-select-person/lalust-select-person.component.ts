import { Component, OnInit, EventEmitter, Input, Output, Injector } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode , NzMessageService, NzTreeService} from 'ng-zorro-antd';
import { SelectPersonService } from './service/selectPerson.service';
@Component({
  selector: 'app-lalust-select-person',
  templateUrl: './lalust-select-person.component.html',
  styleUrls: ['./lalust-select-person.component.css'],
  providers: [NzTreeService]
})
export class LalustSelectPersonComponent implements OnInit {

  /**
   *  之前选中的人
   *  传过来的人
   */
  private _disabledData: any = {};
  @Input()
  public set disabledData(v: any) {
    this._disabledData = v;
    this.filterPeople();
  }
  public get disabledData(): any {
    return this._disabledData;
  }
  
  /**
   *  不能选中的人
   *  
   */
  private _excludeData: any = [];
  @Input()
  public set excludeData(v: any) {
    this._excludeData = v;
    this.filterPeople();
  }
  
  public get excludeData(): any {
    return this._excludeData;
  }
  
  
  
  @Output() changeSelectPeople: EventEmitter<any[]> = new EventEmitter();

  nzTreeService: NzTreeService;

  constructor(
    private injector: Injector,
    private selectPersonService: SelectPersonService,
    private message: NzMessageService
  ) {
    this.nzTreeService = this.injector.get(NzTreeService);
  }


  // cache
  rootKey = '';

  // tree property
  expandKeys = [];
  checkedKeys = [];
  selectedKeys = [];
  expandDefault = true;
  nodes = [];
  deptEmployeeMap = {};
  selectPeople = [];
  selectPeopleMap = {};
  selectAll = false;
  indeterminate = true;

  // source data
  public source: any;

  mouseAction(event: NzFormatEmitEvent): void {

    
    if (event.selectedKeys.length > 0) {
      const key = event.selectedKeys[0].origin.key;
      this.selectPeople = this.deptEmployeeMap[key] || [];
    } else {
      this.selectPeople = [];
    }
    this.filterPeople();
  }

  filterPeople(): void {
    // exclude some people
    const disabledDataCopy = JSON.parse(JSON.stringify(this.disabledData));
    disabledDataCopy.forEach(element => {
      if (this.excludeData[element]) {
        delete this.excludeData[element];
      }
    });
    this.selectPeople.forEach(element => {
      element.setStatus = false;
      if (this.excludeData[element.guid]) {
        element.setStatus = true;
      }
      this.selectPeopleMap[element.guid] = element;
    });
  }

  setSelectPeople() {
    console.log('select people...', this.disabledData);
    this.convertToEmployee(JSON.parse(JSON.stringify(this.source)));
    // for each set checked
    if (this.deptEmployeeMap[this.rootKey]) {
      this.deptEmployeeMap[this.rootKey].forEach(element => {
        element.checked = false;
        this.disabledData.forEach(m => {
          if (element.guid === m && !this.excludeData[element.guid]) {
            element.checked = true;
          }
        });
        
      });
    }
  }

  convertToEmployee(root: any): void {
    this.convert2Employee(root);
    let v = [];
    for (const key in this.deptEmployeeMap) {
      if (this.deptEmployeeMap.hasOwnProperty(key)) {
        const element = this.deptEmployeeMap[key];
        v = v.concat(element);
      }
    }
    // 添加 check
    this.rootKey = root.key;
    v.forEach(element => {
      element.checked = false;
    });
    this.deptEmployeeMap[root.key] = v;
  }

  convert2Employee(department: any): void {
    const total = [].concat(department.employees);
    if (department.children.length > 0) {
      for (let i = 0; i < department.children.length; i++) {
        this.convert2Employee(department.children[i]);
      }
    }
    this.deptEmployeeMap[department.key] = total;

  }

  getDepartmentData(): void {
    this.selectPersonService.getDepartmentData()
    .subscribe((res: any) => {
      if (res.code === 0) {
        this.source = res.data;
        this.nodes = [new NzTreeNode(res.data)];
        this.convertToEmployee(res.data);
      } else {
        this.message.error(res.message);
      }
    });
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.selectAll) {
      const v = [];
      this.selectPeople.forEach(item => {
        if (item.boundStatus !== '0' && item.boundStatus !== '2' && item.setStatus === false) {
          item.checked = true;
          v.push(item);
        }
      });
      this.changeSelectPeople.emit(v);
    } else {
      this.selectPeople.forEach(item => {
        if (item.boundStatus !== '0' && item.boundStatus !== '2' && item.setStatus === false) {
          item.checked = false;
        }
      });
      this.changeSelectPeople.emit([]);
    }

  }

  updateSingleChecked(selectValue: any ): void {

    // const v = [];
    // selectValue.forEach(element => {
    //   v.push(this.selectPeopleMap[element]);
    // });

    // set all check false
    if (this.selectPeople) {
      this.selectPeople.forEach(element => {
        element.checked = false;
      });
    }

    // set check true
    selectValue.forEach(element => {
      this.selectPeopleMap[element].checked = true;
    });

    const v = [];
    if (this.deptEmployeeMap[this.rootKey]) {
      this.deptEmployeeMap[this.rootKey].forEach(element => {
        if (element.checked) {
          v.push(element);
        }
      });
    }

    this.changeSelectPeople.emit(v);
  }

  initChangeSelectPeople() {
    const v = [];
    if (this.deptEmployeeMap[this.rootKey]) {
      this.deptEmployeeMap[this.rootKey].forEach(element => {
        if (element.checked) {
          v.push(element);
        }
      });
    }
    this.changeSelectPeople.emit(v);
  }

  init(): void {
    this.nodes = [];
    this.selectPeople = [];
    this.filterPeople();
    this.setSelectPeople();
    this.nodes = [new NzTreeNode(this.source)];
    this.initChangeSelectPeople();
  }

  ngOnInit() {    
    this.getDepartmentData();
  }

}
