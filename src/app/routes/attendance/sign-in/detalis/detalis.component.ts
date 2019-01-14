import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'detalis',
  templateUrl: './detalis.component.html',
  styleUrls: ['./detalis.component.less']
})
export class DetalisComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private msg: NzMessageService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }
  guid = '';
  signTime = '';
  imgurldetalis = '';
  public loading = false;
  dataDetalis: any = {};
  imgUrlList: any = [];
  imgUrl: any = [];
  isVisible = false;
  ngOnInit() {
    this.loading = true;
    this.route.params
      .subscribe((params: Params) => {
        this.guid = params['guid'];
      });
    this.getDataPart();
  }
  public back() {
    this.router.navigate(['/attendance/signIn']);
  }

  public getDataPart() {
    this.imgUrl = [];
    this.http.get(environment.SERVER_URL + environment.CHECKIN_URL + 'service/signIn/getDetailById', {
      params: {
        guid: this.guid,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.dataDetalis = res.data;
        this.imgUrlList = res.data.signFiles;
        this.imgUrlList.forEach(element => {
          this.imgUrl.push(environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + element);
        });
        this.signTime = this.dataDetalis.signDate + this.dataDetalis.signTime + '00';
        this.loading = false;
      } else {
        this.msg.error(res.message);
        this.loading = false;
      }
    });
  }

  showModal(imgurldetalis): void {
    this.isVisible = true;
    this.imgurldetalis = imgurldetalis;
  }

  Cancel(): void {
    this.isVisible = false;
  }
  Ok(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }
}
