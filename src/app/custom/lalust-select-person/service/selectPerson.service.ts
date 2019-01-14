import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class SelectPersonService {

  constructor(private i18n: NzI18nService, 
    private http: HttpClient, 
    public msg: NzMessageService, 
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService) { }
  
    private url = environment.SERVER_URL + environment.ENTERPRISE_URL;
    private enterpriseGuid = this.token.get().guid;
  
  /**
   * get department data.
   */
  getDepartmentData(): Observable<{}> {
    const params: any = {
      enterpriseGuid: this.enterpriseGuid
    };
    return this.http.get(this.url + 'service/enterprise/dept/employee', {
      params: params
    });
  }

}
