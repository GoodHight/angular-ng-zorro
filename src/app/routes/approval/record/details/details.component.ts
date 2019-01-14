import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
// import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'details-module',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent implements OnInit {
  public guid: any;
  public url = environment.APPROVAL_URL;
  public dataList: any = {};
  constructor(private route: ActivatedRoute, private http: HttpClient, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    this.route.params.subscribe((params) => {
      this.guid = params['guid'];
    });
  }
  lastState: any;
  ngOnInit() {
    this.getData(); 
  }
  /**
   * 获取审批详情数据
   */
  getData() {
    let userId = '';
    if (this.tokenService.get().type === 1) {
      userId = this.tokenService.get().guid;
    } else {
      userId = this.tokenService.get().userId;
    }
    this.http.get(this.url + 'service/approvalRecord/' + this.guid, {
      params: {
        userId: userId,
        enterpriseId: this.tokenService.get().guid,
      }
    })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.dataList = res.data;
          if (this.dataList.type === 7) {
            this.dataList.type = '离职';
          } else if (this.dataList.type === 1) {
            this.dataList.type = '请假';
          } else if (this.dataList.type === 2) {
            this.dataList.type = '外出';
          } else if (this.dataList.type === 3) {
            this.dataList.type = '出差';
          } else if (this.dataList.type === 4) {
            this.dataList.type = '补打卡';
          } else if (this.dataList.type === 5) {
            this.dataList.type = '转正';
          } else if (this.dataList.type === 6) {
            this.dataList.type = '调岗';
          }
          if (this.dataList.businessObject.type === 0) {
            this.dataList.businessObject.type = '年假';
          } else if (this.dataList.businessObject.type === 1) {
            this.dataList.businessObject.type = '事假';
          } else if (this.dataList.businessObject.type === 2) {
            this.dataList.businessObject.type = '病假';
          } else if (this.dataList.businessObject.type === 3) {
            this.dataList.businessObject.type = '调休';
          } else if (this.dataList.businessObject.type === 4) {
            this.dataList.businessObject.type = '婚假';
          } else if (this.dataList.businessObject.type === 5) {
            this.dataList.businessObject.type = '产假';
          } else if (this.dataList.businessObject.type === 6) {
            this.dataList.businessObject.type = '陪产假';
          } else if (this.dataList.businessObject.type === 7) {
            this.dataList.businessObject.type = '哺乳假';
          } else if (this.dataList.businessObject.type === 8) {
            this.dataList.businessObject.type = '工伤假';
          } else if (this.dataList.businessObject.type === 9) {
            this.dataList.businessObject.type = '丧假';
          }
          this.lastState = this.dataList.status;
          // console.log(this.lastState);
        } else {
          this.msg.error(res.message);
        }
      });
  }

}
