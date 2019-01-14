import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-notice',
  templateUrl: './app-notice.component.html',
  styleUrls: ['./app-notice.component.less']
})
export class AppNoticeComponent implements OnInit {
  public content = '';
  public guid = '';
  public messageTime = '';
  public title = '';
  imgSrc = '';
  constructor(private http: HttpClient, private msg: NzMessageService, private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe((params) => {
      this.guid = params['uuid'];
    });
    this.getData();
  }

  ngOnInit() {
  }
  /**
   * name
   */
  public getData() {
    this.http.get(environment.UPLOADER_URL + environment.NOTICE_URL + 'service/notice/' + this.guid).subscribe((res: any) => {
      if (res.code === 0) {
        this.content = res.data.content;
        this.title = res.data.title;
        this.messageTime = res.data.createTime;
        if (res.data.noticeCover !== '') {
          this.imgSrc = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + res.data.noticeCover;
        }
      } else {
        this.msg.error(res.message);
      }
    }, response => {

    });
  }
}
