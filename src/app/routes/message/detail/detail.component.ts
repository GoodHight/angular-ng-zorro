import { Component, OnInit , Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  // 接口字符串
  typeUrl = environment.SERVER_URL + environment.MESSAGE_URL;
  // 定义的数组
  // dataList: any; 
  // 用户登录id
  userGuid: any;
  detailGuid: any;
  dataList = {
    title: '',
    publishTime: '',
    content: ''
  };

  // 删除判断
  public Visible = false;
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, public msg: NzMessageService) { }

  ngOnInit() {
    // 获取用户登录id
    this.userGuid = this.tokenService.get().guid;
    
    // 获取详情的id
    this.route.params
      .subscribe((params: Params) => {    
        this.detailGuid = params['id'];
      });
      this.getMessageData();
      
    
  }
  // 获取数据
  getMessageData() {
    this.http.get(this.typeUrl + 'service/message/user/' + this.detailGuid, { params:
       { userId: this.userGuid} 
      })
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.dataList = res.data;

        }
      });
  }
  back() {
    this.router.navigate(['/message/list']);
  }
  
  
  
  // 详情
  // back() {
  //   this.router.navigate(['/message/detail']);
  // }

}
