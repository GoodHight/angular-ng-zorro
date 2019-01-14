import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
})
export class StorageListComponent implements OnInit {
  httpUrl = environment.HRM_URL + 'service/school/temp-certificate';
  // 加载等待
  loading = false;
  dataList;
  showSearch = 0;
  searchKey;
  // 筛选条件
  selectCondition = '';
  // 分页相关
  pageTotal = 0;
  pageIndex = 1;
  pageSize = 20;
  constructor(
    private http: HttpClient,
    private msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pageChange(1);
  }
  
  /**
   * 得到个人存证
   */
  getPersonStorage() {
    this.loading = true;
    this.http.get(this.httpUrl + '/personal', {
      params: {
        singerGuid : this.tokenService.get().userGuid
      }
    }).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 1) {
        this.dataList = res.data;
      } else {
        this.dataList = [];
        this.pageTotal = 0;
      }
    });
  }

  pageChange(i) {
    if (i === 0 ) {
      return;
    } else {
      this.pageIndex = i;
    }
      this.getPersonStorage();
  }

  gotoDetail(item) {
    window.open('#/storages/detail/' + item.guid);
    // this.router.navigate(['/blockchain-detail/' + item.guid]);
  }
}
