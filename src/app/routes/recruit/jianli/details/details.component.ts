import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.less'],
  templateUrl: './details.component.html',
})
export class DetailsComponent implements OnInit {
  // 简历的id
  resumeGuid: any;

  // 返回来的数据
  dataList = {
    name: '',
    phone: '',
    email: '',
    applyPosition: '',
    workYear: '',
    education: '',
    graduatedFrom: '',
    lastCompany: '',
    fileId: ''
  };
  // 推荐详情的数组
  recommendData: any;

  active: true;
  // 面试通知
  interviewData: any;
  // 录用审批详情数组
  approvalData: any;
  // 录用审批
  employData: any;
  // 查看offer
  offerData: any;
  // 折叠面板
  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      arrow: true
    },
    // {
    //   active: false,
    //   arrow : false,
    //   name  : 'This is panel header 2'
    // }
  ];

  // url
  public url = environment.SERVER_URL + '/recruit';
  constructor(private http: HttpClient,
    private fb: FormBuilder, private msg: NzMessageService, private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute) {
    this.route.params
      .subscribe((params: Params) => {
        return this.resumeGuid = params['guid'];
      });
  }

  recomendTitle = '推荐详情';
  interviewTitle = '面试通知';
  feedbackTitle = '面试结果反馈';
  employTitle = '录用审批详情';
  offerTitle = '查看offer';
    // 判断下载按钮的状态
  public  isDown = true;
  ngOnInit() {
    this.getData();

  }
  /*
* 获取列表数据
* */
  public getData() {

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    this.http.get(this.url + '/service/resume/' + this.resumeGuid)
      .subscribe((res: any) => {
        if (res.code === 0) {
          // 个人信息详情
          this.dataList = res.data.resume;
          // 推荐详情
          this.recommendData = res.data.resumeRecommend;
          if (this.recommendData === '') {
            // console.log('无推荐详情');
          }

          // 面试通知 && 面试结果反馈
          this.interviewData = res.data.interview;
          // console.log(this.interviewData);

          // 录用审批
          this.employData = res.data.employApproval;
          // 查看offer
          this.offerData = res.data.offer;

          // 
          if (this.dataList.fileId === '') {
            this.isDown = true;
            // console.log(this.isDown);
          } else {
            this.isDown = false;
            // console.log(this.isDown);
          }

        } else {
          this.msg.error('没有数据');
        }
      }, response => {
        return;
      });
  }

  // 下载简历
  dowResume(fileId) {
    location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + fileId;
  }
  cancelAct() {
    //  this.router.navigate(['/recruit']);
    window.history.go(-1);
  }

}
