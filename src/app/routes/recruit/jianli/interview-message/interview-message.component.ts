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
  selector: 'interview-message',
  templateUrl: './interview-message.component.html',
  styleUrls: ['./interview-message.component.less']
})
export class InterviewMessageComponent implements OnInit {
  userId: any;
  enterpriseId: any;
  resumeId: any;
  interviewPostion: any;
  interviewDate: any;
  interviewTime: any;
  interviewAddress: any;
  interviewNotifyEmailTemplateId: any;
  responsibleName: any;
  responsiblePhone: any;

  inteviewNoticeTitle: any;
  inteviewNoticeContent: any;
  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService) {
    this.route.params
        .subscribe((params: Params) => {
            return this.userId = params['guid'];
        });
}

  public url = environment.SERVER_URL + '/recruit';
  templateDataEamil: any;
  contentEmail: any;
  content: any;
  ngOnInit() {
    this.content = JSON.parse(localStorage.getItem('info'));
    localStorage.removeItem('info');
    this.resumeId = this.content.resumeId;
    this.interviewPostion = this.content.interviewPostion;
    this.interviewDate = this.content.interviewDate;
    this.interviewTime = this.content.interviewTime;
    this.interviewAddress = this.content.interviewAddress;
    this.interviewNotifyEmailTemplateId = this.content.interviewNotifyEmailTemplateId;
    this.responsibleName = this.content.responsibleName;
    this.responsiblePhone = this.content.responsiblePhone;
    if (this.reuseTabService.get().type === 1) {
        this.userId = this.reuseTabService.get().guid;
    } else {
        this.userId = this.reuseTabService.get().userId;
    }
    this.enterpriseId = this.reuseTabService.get().guid;
    this.getTemplateEmail();
  }
  // 返回按钮
  cancel() {

  }
      // 查询面试通知邮--邮件--模板列表
      getTemplateEmail() {
        this.http.get(this.url + '/service/interview/view', {
            params: {
                userId: this.userId,
                enterpriseId: this.enterpriseId,
                resumeId: this.resumeId,
                interviewPostion: this.interviewPostion,
                interviewDate: this.interviewDate,
                interviewTime: this.interviewTime,
                interviewAddress: this.interviewAddress,
                interviewNotifyEmailTemplateId: this.interviewNotifyEmailTemplateId,
                responsibleName: this.responsibleName,
                responsiblePhone: this.responsiblePhone,
            }
        }).subscribe((res: any) => {
            if (res.code === 0) {
                // console.log(res.data);
                this.inteviewNoticeTitle = res.data.title;
                this.inteviewNoticeContent = res.data.content;
            } else {
                this.msg.error(res.message, { nzDuration: 3000 });
            }
            
        });
    }

}
