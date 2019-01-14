import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
    public toolbar = true;
    
    /*
 * 员工Guid
 * */
    guid;

    tabs = [];
    constructor(private http: HttpClient, private router: Router, private activateRoute: ActivatedRoute) {
    }

    to(item: any) {
        this.router.navigateByUrl(`${item.key}`).then();
    }

    /*
   * 取消todo
   * */
    cancel() {
        this.router.navigate(['/personnel-admin/employee-info/index']);
    }

    ngOnInit() {
        this.activateRoute.params.subscribe((params: Params) => {
             this.guid = params['guid'];
        });
     
    }

}
