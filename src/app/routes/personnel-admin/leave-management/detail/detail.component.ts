import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { _Validators } from '@delon/util';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  tabs = [];

  tab: any;
  public tabSelectIndex = 8;
  uuid = this.tokenService.get().guid;
  type: any;
  public form: FormGroup;
  dateFormat: 'yyyyMMdd';
  loading: false;
  guid;
  dataList = [];
  employee: any = {}; // 员工信息
  employeeContacts: any = []; // 通讯
  employeeStation: any = {}; // 岗位信息
  employeeContracttables: any = []; // 合同信息
  employeeEducations: any = []; // 教育信息
  employeeEmployments: any = []; // 从业信息
  employeeTitle: any = {}; // 培训信息
  employeeWelfare: any = {}; // 社保信息
  employeeDimission: any = {}; // 离职信息
  isVisibles = false;
  userId = '';
  url = environment.SERVER_URL + environment.ENTERPRISE_URL;
  private cityUrl = environment.FRAMEWORK_URL + 'service';
  // private dictionaryUrl = environment.FRAMEWORK_URL + 'service';
  private dictionaryUrl = environment.SERVER_URL + environment.COMMONS_URL;
  departmentOptions = [];
  public isLoading = false;
  @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router, private route: ActivatedRoute,
    public scroll: ScrollService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }

  /*
  * 取消todo
  * */
  cancel() {
    this.router.navigate(['/personnel-admin/leave-management/leave-list/esignation']);
  }

  /*
  * 获取员工信息
  * */
  getEmployeeInfo() {
    this.http.get(this.url + 'service/enterprise/dimission/employee/' + this.guid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.employee = res.data.employee;
          this.employeeContacts = res.data.employeeContacts;
          this.employeeContracttables = res.data.employeeContracttables;
          this.employeeEducations = res.data.employeeEducations;
          this.employeeEmployments = res.data.employeeEmployments;
          this.employeeStation = res.data.employeeStation;
          this.employeeTitle = res.data.employeeTitle;
          this.employeeWelfare = res.data.employeeWelfare;
          this.employeeDimission = res.data.employeeDimission;
          this.loading = false;
        } else {
          this.msg.error('没有数据');
          this.loading = false;
        }
      }, response => {
        this.msg.error('系统错误');
        return;
      });
  }


  ngOnInit(): void {

    if (this.tokenService.get().type === 1) {
      this.userId = this.tokenService.get().guid;
    } else {
      this.userId = this.tokenService.get().userId;
    }
    this.route.params
      .subscribe((params: Params) => {
        this.guid = params['guid'];
      });
    this.getEmployeeInfo();
  }

}
