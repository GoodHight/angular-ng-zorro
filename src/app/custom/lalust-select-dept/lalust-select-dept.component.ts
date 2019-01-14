import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode , NzMessageService} from 'ng-zorro-antd';
import { DeptService } from './service/dept.service';

@Component({
  selector: 'app-lalust-select-dept',
  templateUrl: './lalust-select-dept.component.html',
  styleUrls: ['./lalust-select-dept.component.css']
})
export class LalustSelectDeptComponent implements OnInit, OnChanges {

  @Output() changeSelectDept: EventEmitter<any[]> = new EventEmitter();

  private _LSDselectRaw: any;
  @Input()
  public set LSDselectRaw(v: any) {
    this._LSDselectRaw = v;
    this.initLoadSelectDepts();
  }
  public get LSDselectRaw(): any {
    return this._LSDselectRaw;
  }
  
  

  constructor(
    private deptService: DeptService,
    private message: NzMessageService
  ) { }

  // tree property
  expandKeys = [];
  checkedKeys = [];
  selectedKeys = [];
  expandDefault = true;
  nodes = [];

  selectDept = [];

  // source data
  public source: any;


  mouseAction(event: NzFormatEmitEvent): void {
    if (event.node.level === 0) return;
    if (event.selectedKeys.length > 0) {
      // const key = event.selectedKeys[0].origin.key;
    }
    this.selectDept = [];
    event.selectedKeys.forEach(element => {
      if (element.level === 0) return false;
      this.selectDept.push({
        guid: element.key,
        title: element.title
      });
    });
    this.changeSelectDept.emit(this.selectDept);
  }

  removeSelectDept(key): void {
    // find index
    let index = -1;
    this.selectDept.forEach((element, i) => {
      if (key === element.guid) {
        index = i;
      }
    });
    // remove
    this.selectDept.splice(index, 1);
    this.changeSelectDept.emit(this.selectDept);

    // remove this.selectedKeys
    this.nodes = [];
    this.selectedKeys = [];
    if (this.selectDept.forEach) {
      this.selectDept.forEach(element => {
        this.selectedKeys.push(element.guid);
      });
    }
    this.nodes.length = 0;
    const v = new NzTreeNode(this.source);
    if (v && v.level === 0) {
      v.isDisabled = true;
    }
    this.nodes = [v];
    
  }

  
  getDepartmentData(): void {
    this.deptService.getDepartmentData()
    .subscribe((res: any) => {
      if (res.code === 0) {
        const v = new NzTreeNode(res.data);
        if (v && v.level === 0) {
          v.isDisabled = true;
        }
        this.source = v;
        this.nodes = [v];
      } else {
        this.message.error(res.message);
      }
    });
  }

  initLoadSelectDepts(): void {
    this.selectDept = this.LSDselectRaw;
    if (this.LSDselectRaw.forEach) {
      this.LSDselectRaw.forEach(element => {
        this.selectedKeys.push(element.guid);
      });
    }
  }

  ngOnInit() {
    this.getDepartmentData();
    this.initLoadSelectDepts();
  }

  resetSelect(): void {
    this.initLoadSelectDepts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.

    if (changes.LSDselectRaw && changes.LSDselectRaw.currentValue) {
      this.selectDept = changes.LSDselectRaw.currentValue;
    }
    
  }

}
