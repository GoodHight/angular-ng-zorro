import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
/**
 *
 *  
 * @export
 * @class GroupService
 */
@Injectable({
  providedIn: 'root'
})
export class GroupService {

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
  getData(queryParams): Observable<{}> {
    const params: any = {
      pageNum: queryParams.pageIndex,
      pageSize: queryParams.pageSize,
      // guid: '',
      name: queryParams.query,
      enterpriseId: this.enterpriseGuid
    };
    return this.http.get(this.url + 'service/clockinGroup/getGroup', {
      params: params
    });
  }

  /**
   * add one attendance group
   * @param group attendance gorup object
   */
  addGroup(group: any): Observable<{}> {
    const params: any = {
      // guid: '',
      enterpriseId: this.enterpriseGuid,
      // group
      name: group.name,
      userIds: group.userIds,
      mgrUserId: group.mgrUserId,
      workdayId: group.workdayId,
      classesid: group.classesid,
      siteId: group.siteId
    };
    return this.http.post(this.url + 'service/clockinGroup/addGroup', null, {
      params: params
    });
  }

  /**
   * update the attendance group
   * @param group attendance gorup object
   */
  updateGroup(group: any): Observable<{}> {
    const params: any = {
      guid: group.guid,
      enterpriseId: this.enterpriseGuid,
      // group
      name: group.name,
      userIds: group.userIds,
      mgrUserId: group.mgrUserId,
      workdayId: group.workdayId,
      classesid: group.classesid,
      siteId: group.siteId
    };
    return this.http.put(this.url + 'service/clockinGroup/updateGroup', null, {
      params: params
    });
  }


  /**
   * delete group by group id.
   * @param guid group id
   */
  deleteGroupById(guid: string): Observable<{}> {
    const params: any = {
      guid: guid,
      enterpriseId: this.enterpriseGuid,
    };
    return this.http.delete(this.url + 'service/clockinGroup/delGroup', {
      params: params
    });
  }

  /**
   * format date
   * @param date
   */
  formatDate(date: Date): string {
    const m = (date.getMonth() + 1).toString().length > 1 ?
      (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString();
    const d = date.getDate().toString().length > 1 ? 
      date.getDate().toString() : '0' + date.getDate().toString();
    // return date.getFullYear() + '-' + m + '-' + d;
    return date.getFullYear() + '' + m + '' + d + '000000';
  }

  // get clockin peoples
  getClockinPeople(): Observable<{}> {
    const params: any = {
      enterpriseId: this.enterpriseGuid
    };
    return this.http.get(this.url + 'service/clockinGroup/getClockinGroupUsers', {
      params: params
    });
  }

  // connect other module api.....
  /**
   * get source data.
   * @param queryParams query params
   */
  getWorkDayData(): Observable<{}> {
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
   * get source data.
   * @param queryParams query params
   */
  getShiftData(): Observable<{}> {
    const params: any = {
      // guid: '',
      enterpriseId: this.enterpriseGuid
    };
    return this.http.get(this.url + 'service/classes/getClassesInfo', {
      params: params
    });
  }
  

  /**
   * get source data.
   * @param queryParams query params
   */
  getWorkAddressData(): Observable<{}> {
    const params: any = {
      // guid: '',
      enterpriseId: this.enterpriseGuid
    };
    return this.http.get(this.url + 'service/clockinSite/getSite', {
      params: params,
      headers: this.headers
    });
  }

}
