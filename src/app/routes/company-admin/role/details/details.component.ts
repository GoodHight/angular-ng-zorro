import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router';
import {environment} from '@env/environment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
})
export class DetailsComponent implements OnInit {

    public guid: any;
    public url = environment.HRM_URL + 'service';
    public formData = {
        roleState: '',
        roleName: '',
        roleScope: ''
    };


    constructor(
    private http: HttpClient, private activatedRoute: ActivatedRoute,
  ) {
        this.activatedRoute.params
            .subscribe((params: Params) => {
                return this.guid = params['guid'];
            });
    }

    /*
  * 编辑获取数据
  * */
    private getData() {
        this.http.get(this.url + '/hrm-role/' + this.guid)
            .subscribe((res: any) => {
                if (res.code === 1) {
                    if (res.data.isTemplet === 0) {
                        res.data.isTemplet = '0';
                    } else {
                        res.data.isTemplet = '1';
                    }
                    this.formData = res.data;
                }
            });
    }

  ngOnInit() {
      this.getData();
  }

}
