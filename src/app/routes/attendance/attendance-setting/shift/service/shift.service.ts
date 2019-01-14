import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

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
  getData(): Observable<{}> {
    const params: any = {
      // guid: '',
      enterpriseId: this.enterpriseGuid
    };
    return this.http.get(this.url + 'service/classes/getClassesInfo', {
      params: params
    });
  }

  /**
   * add one attendance shift
   * @param shift attendance gorup object
   */
  addShift(shift: any): Observable<{}> {
    const params: any = {
      // guid: '',
      enterpriseId: this.enterpriseGuid,
      // shift
      name: shift.name,
      startWorkTime: this.formatTime(shift.workST),
      endWorkTime: this.formatTime(shift.workET),
      clockinStartTime: this.formatTime(shift.clockST),
      clockinEndTime: this.formatTime(shift.clockET),
      workOnDay: shift.selectedValueWork,
      clockinOnDay: shift.selectedValueClock,
      openLate: shift.switchValueLate === true ? 1 : 0,
      openEarly: shift.switchValueEarly  === true ? 1 : 0,
      lateTime: this.formatTime(shift.lateTime),
      earlyTime: this.formatTime(shift.earlyTime),
    };
    return this.http.post(this.url + 'service/classes/addClasses', null, {
      params: params
    });
  }

  /**
   * update the attendance shift
   * @param shift attendance gorup object
   */
  updateShift(shift: any): Observable<{}> {
    const params: any = {
      guid: shift.guid,
      enterpriseId: this.enterpriseGuid,
      // shift
      name: shift.name,
      startWorkTime: this.formatTime(shift.workST),
      endWorkTime: this.formatTime(shift.workET),
      clockinStartTime: this.formatTime(shift.clockST),
      clockinEndTime: this.formatTime(shift.clockET),
      workOnDay: shift.selectedValueWork,
      clockinOnDay: shift.selectedValueClock,
      openLate: shift.switchValueLate === true ? 1 : 0,
      openEarly: shift.switchValueEarly  === true ? 1 : 0,
      lateTime: this.formatTime(shift.lateTime),
      earlyTime: this.formatTime(shift.earlyTime),
    };
    return this.http.put(this.url + 'service/classes/updateClasses', null, {
      params: params
    });
  }


  /**
   * delete shift by shift id.
   * @param guid shift id
   */
  deleteShiftById(guid: string): Observable<{}> {
    return this.http.put(this.url + 'service/classes/delClasses', null, {
      params: {
        guid: guid
      }
    });
  }

  /**
   * format date
   * @param date
   */
  formatTime(date: Date): string {
    if (!date || !date.getHours) return '';
    const h = (date.getHours()).toString().length > 1 ?
      (date.getHours()).toString() : '0' + (date.getHours()).toString();
    const m = date.getMinutes().toString().length > 1 ? 
      date.getMinutes().toString() : '0' + date.getMinutes().toString();
    return h + '' + m;
  }

}
