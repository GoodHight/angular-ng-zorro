import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class WorkdayService {

  constructor(private i18n: NzI18nService, 
    private http: HttpClient, 
    public msg: NzMessageService, 
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService) { }
  
    private url = environment.SERVER_URL + environment.CHECKIN_URL;
    private enterpriseGuid = this.token.get().guid;
    private headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  
    /**
   * get source data.
   * @param queryParams query params
   */
  getData(): Observable<{}> {
    const params: any = {
      // guid: '',
      enterpriseId: this.enterpriseGuid
    };
    return this.http.post(this.url + 'service/workday/getWorkday', null, {
      params: params,
      headers: this.headers
    });
  }

  /**
   * add one attendance group
   * @param group attendance gorup object
   */
  addGroup(group: any): Observable<{}> {
    return this.http.post(this.url + 'service/workday/addWorkday', {
      enterpriseId: this.enterpriseGuid,
      // group
      name: group.name,
      rule: group.rule,
      holidayRestFlag: group.holidayRestFlag === true ? 0 : 1
    });
  }

  /**
   * update the attendance group
   * @param group attendance gorup object
   */
  updateGroup(group: any): Observable<{}> {
    return this.http.put(this.url + 'service/workday/updateWorkday', {
      guid: group.guid,
      enterpriseId: this.enterpriseGuid,
      // group
      name: group.name,
      rule: group.rule,
      holidayRestFlag: group.holidayRestFlag === true ? 0 : 1
    });
  }


  /**
   * delete group by group id.
   * @param guid group id
   */
  deleteAddressById(guid: string): Observable<{}> {
    return this.http.delete(this.url + 'service/workday/delWorkday?guid=' + guid);
  }

}
