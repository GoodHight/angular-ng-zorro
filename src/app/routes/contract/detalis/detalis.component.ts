import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
// import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'detalis',
  templateUrl: './detalis.component.html',
  styleUrls: ['./detalis.component.css']
})
export class DetalisComponent implements OnInit {
  public guid: any;
  public loading = false;
  public url = environment.CONTRACT_URL;
  public dataList: any = {
    businessObject: {}
  };
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
   * 获取详情数据
   */
  getData() {
    this.loading = false;
    this.http.get(this.url + 'service/contract/sign/getContractInfoForApp', {
      params: {
        contractId: this.guid,
      }
    }).subscribe((res: any) => {
      if (res.code === 0) {
        this.dataList = res.data;
      } else {
        this.msg.error(res.message);
      }
      this.loading = true;
    });
  }

}
