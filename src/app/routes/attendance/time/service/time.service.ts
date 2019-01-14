import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

constructor(private i18n: NzI18nService, 
  private http: HttpClient, 
  public msg: NzMessageService, 
  @Inject(DA_SERVICE_TOKEN) private token: ITokenService) { }


private url = environment.SERVER_URL + environment.CHECKIN_URL;
private enterpriseGuid = this.token.get().guid;

/**
 * get source data.
 * @param queryParams query params
 */
getData(queryParams): any {
  const params: any = {
    pageNum: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    searchName: queryParams.searchName,
    startTime: queryParams.startTime,
    endTime: queryParams.endTime,
    enterpriseId: this.enterpriseGuid,
    // userId: ''
  };
  return this.http.get(this.url + 'service/checkin/punch', {
    params: params
  })
  .toPromise()
  .then(response => response)
  .catch(this.handleError);
}

/**
 * get source data.
 * @param queryParams query params
 */
getData2(queryParams): Observable<{}> {
  const params: any = {
    pageNum: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    searchName: queryParams.searchName,
    startTime: this.formatDate(queryParams.startTime) + '000000',
    endTime: this.formatDate(queryParams.endTime) + '235959',
    enterpriseId: this.enterpriseGuid,
    // userId: ''
  };
  return this.http.get(this.url + 'service/checkin/punch', {
    params: params
  });
}


/**
 * export
 * @param queryParams 
 */
export(queryParams): void {
  location.href = this.url + 'service/checkin/exportPunch?enterpriseId=' 
  + this.enterpriseGuid + '&searchName=' + queryParams.searchName 
  + '&startTime=' + this.formatDate(queryParams.startTime) + '000000'
  + '&endTime=' + this.formatDate(queryParams.endTime) + '235959';
}

/**
   * format date
   * @param date
   */
  formatDate(date: Date): string {
    console.log(date);
    
    const m = (date.getMonth() + 1).toString().length > 1 ?
      (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString();
    const d = date.getDate().toString().length > 1 ? 
      date.getDate().toString() : '0' + date.getDate().toString();
    // return date.getFullYear() + '-' + m + '-' + d;
    return date.getFullYear() + '' + m + '' + d;
  }

/**
 * handle return error info.
 * @param error error info.
 */
private handleError(error: any): Promise<any> {
  return Promise.reject(error.message);
}

}
