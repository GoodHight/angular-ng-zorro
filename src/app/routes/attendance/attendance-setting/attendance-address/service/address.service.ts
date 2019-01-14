import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { en_US, zh_CN, NzI18nService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

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
    return this.http.get(this.url + 'service/clockinSite/getSite', {
      params: params,
      headers: this.headers
    });
  }

  public viewModel = {
    guid: '',
    enterpriseId: '',
    name: '',
    site: '',
    effectiveRange: '',
    coordinate: ''
  };
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
      site: group.site,
      effectiveRange: group.effectiveRange,
      coordinate: group.coordinate
    };
    return this.http.post(this.url + 'service/clockinSite/addSite', {}, {
      params: params,
      headers: this.headers
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
      site: group.site,
      effectiveRange: group.effectiveRange,
      coordinate: group.coordinate
    };
    return this.http.put(this.url + 'service/clockinSite/updateClasses',  {}, {
      params: params,
      headers: this.headers
    });
  }


  /**
   * delete group by group id.
   * @param guid group id
   */
  deleteAddressById(guid: string): Observable<{}> {
    return this.http.put(this.url + 'service/clockinSite/delClasses?guid=' + guid , {});
  }


  queryGeocode(location: any): Observable<{}> {
    return this.http.post('https://restapi.amap.com/v3/geocode/regeo', null, {
      params: {
        output: 'xml',
        location: location,
        key: 'c15a52ae7244701ec7bb97620666b0de',
      }
    });
  }

}
