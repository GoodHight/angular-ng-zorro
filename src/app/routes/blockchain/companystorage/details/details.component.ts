import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'detailsss',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent implements OnInit {
  httpUrl = environment.SERVER_URL + '/storage/';
  dataList: any = {};
  guid = '';
  constructor(private http: HttpClient,
    private msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.guid = params['guid'];
      });
    this.getData();
  }
  getData() {
    this.http.get(this.httpUrl + 'service/infoStorage/' + this.guid).subscribe((res: any) => {
      // console.log(res);
      if (res.code === 0) {
        this.dataList = res.data;
      } else {
        this.msg.error(res.message);
      }
    });
  }
  cancel() {
    this.router.navigate(['/blockchain/companystorage/index']);
  }
  // 单个下载
  dow(fileId) {
    location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + this.dataList.fileId;
  }
}
