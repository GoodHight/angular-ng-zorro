import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import { SelectPersonService } from './service/selectPerson.service';

@Component({
  selector: 'app-lalust-select-person-single',
  templateUrl: './lalust-select-person-single.component.html',
  styleUrls: ['./lalust-select-person-single.component.css']
})

export class LalustSelectPersonSingleComponent implements OnInit {

  @Output() changeSelectPeople: EventEmitter<any[]> = new EventEmitter();

  constructor(
    private selectPersonService: SelectPersonService,
    private message: NzMessageService
  ) { }
  sourceData: any;
  // tree property
  expandKeys = [];
  checkedKeys = [];
  selectedKeys = [];
  expandDefault = true;
  nodes = [];
  deptEmployeeMap = {};
  selectPeople = [];
  selectPeopleMap = {};

  radioValue = '';

  mouseAction(event: NzFormatEmitEvent): void {

    if (event.selectedKeys.length > 0) {
      const key = event.selectedKeys[0].origin.key;
      this.selectPeople = this.deptEmployeeMap[key] || [];
    } else {
      this.selectPeople = [];
    }

    this.selectPeople.forEach(element => {
      this.selectPeopleMap[element.guid] = element;
    });
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
          // this.gsname = res.data.title;
          this.sourceData = res.data;
          this.nodes = [new NzTreeNode(JSON.parse(JSON.stringify(this.sourceData)))];
          this.convertToEmployee(JSON.parse(JSON.stringify(this.sourceData)));
        } else {
          this.message.error(res.message);
        }
      });
  }


  updateSingleChecked(selectValue: any): void {
    // reset to array
    const v = [];
    v.push(this.selectPeopleMap[selectValue]);
    this.changeSelectPeople.emit(v);
  }

  reset(guid, type) {
    this.selectPeople = [];
    if (type === 1) {
      this.radioValue = guid;
    } else {
      this.radioValue = '';
    }

  }

  ngOnInit() {
    this.getDepartmentData();
  }

}
