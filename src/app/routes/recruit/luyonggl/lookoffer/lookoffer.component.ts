import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'lookoffer',
  templateUrl: './lookoffer.component.html',
  styleUrls: ['./lookoffer.component.less']
})
export class LookofferComponent implements OnInit {
    inteviewNoticeTitle: any;
    inteviewNoticeContent: any;
    content: any;
    param = {
        userId: '',
        enterpriseId: '',
        resumeId: '',
      //   interviewId: ',
        interviewEmployApprovalId: '',
        entryDateTime: '',
        probationStage: '',
        entryPostion: '',
        entryAddress: '',
        entryDepartmentId: '',
        entryDepartmentName: '',
        workNature: '',
        payWay: '',
        payOnTrial: '',
        payRegularWorker: '',
        payRemark: '',
        contactsId: '',
        contactsName: '',
        contactsPhone: '',
        offerNotifyEmailTemplateId: ''
    };
 
  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService) {
    this.route.params
        .subscribe((params: Params) => {
            return this.param.userId = params['guid'];
        });
}

  public url = environment.SERVER_URL + '/recruit';
  templateDataEamil: any;
  contentEmail: any;
  ngOnInit() {
    this.content = JSON.parse(localStorage.getItem('info'));
    // localStorage.removeItem('info');
    this.param = Object.assign(this.param, this.content);
    // console.log(this.param);
    if (this.reuseTabService.get().type === 1) {
        this.param.userId = this.reuseTabService.get().guid;
    } else {
        this.param.userId = this.reuseTabService.get().userId;
    }
    this.param.enterpriseId = this.reuseTabService.get().guid;
    this.getTemplateEmail();
  }
  // 返回按钮
  cancel() {

  }
      // 查询offer通知邮--邮件--模板列表
      getTemplateEmail() {
        this.http.get(this.url + '/service/interviewOffer/view', {
            params: this.param
        }).subscribe((res: any) => {
            if (res.code === 0) {
                // console.log(res.data);
                this.inteviewNoticeTitle = res.data.title;
                this.inteviewNoticeContent = res.data.content;
               /*  this.templateDataEamil = res.data;
                // console.log(this.templateDataEamil);
                this.templateDataEamil.forEach(item => {
                    this.contentEmail = item.content;
                }); */
            }
            if (res.code !== 0) {
                // this.detailData = [];
                this.msg.error(res.message);
            }
        });
    }

}
