import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

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
getData(queryParams): Observable<{}> {
  const params: any = {
    pageNum: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    searchName: queryParams.searchName,
    startTime: this.formatDate(queryParams.startTime) + '000000',
    endTime: this.formatDate(queryParams.endTime) + '235959',
    enterpriseId: this.enterpriseGuid
  };
  return this.http.get(this.url + 'service/clockinDetails/everyday', {
    params: params
  });
}

/**
 * export
 * @param queryParams 
 */
export(queryParams): void {
  location.href = this.url + 'service/clockinDetails/exportDayRecord?enterpriseId=' 
  + this.enterpriseGuid + '&searchName=' + queryParams.searchName + '&startTime=' 
  + this.formatDate(queryParams.startTime) + '000000'
  + '&endTime=' + this.formatDate(queryParams.endTime) + '235959';
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
    return date.getFullYear() + '' + m + '' + d;
  }

}
