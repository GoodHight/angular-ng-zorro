import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-index',
    styleUrls: ['./index.component.less'],
    templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {

    public toolbar = true;
    public tabSelectIndex = 4;
    clicktype = '1';
    clicktype2 = '2';
    // 判断显示隐藏
    public serachType = 0;
    tabs = [{
        key: '/recruit/resume/' + this.clicktype,
        tab: '新简历',
    }, {
        key: '/recruit/interview/' + this.clicktype2,
        tab: '已推荐',
    }];

    /*
  * 搜索框
  * */
    showSerach() {
        this.serachType = 1;
    }
    refreshNzTable() {


    }

    constructor(private http: HttpClient, private router: Router, private activateRoute: ActivatedRoute) {
    }

    to(item: any) {
        this.router.navigateByUrl(`${item.key}`).then();
    }

    ngOnInit() {
        this.activateRoute.params.subscribe((params) => {
            this.tabSelectIndex = params['guid'];              
        });

    }
    // 获取数据


}
