import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { GlobalState } from '../../service/global.state';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-news',
    styleUrls: ['./news.component.less'],
    templateUrl: './news.component.html'
})

export class NewsComponent implements OnInit, OnDestroy {
    public toolbar: Boolean = true;
    public tabSelectIndex = 0;

    tabs = [{
        key: 'notice',
        tab: '公告信息',
    }, {
        key: 'system',
        tab: '制度信息',
    }
    ];
    key = '';
    constructor(private router: Router, private _message: NzMessageService, private globalState: GlobalState) {
        this.globalState.subscribe('toolbar', (success) => {
            this.toolbar = success;
        });
    }

    ngOnInit(): void {
        // console.log(this.tabSelectIndex);
        // this.to(this.tabs[this.tabSelectIndex]);
    }

    to(item: any) {
        this.router.navigateByUrl(`/news/${item.key}`).then();
    }


    ngOnDestroy() {
        this.globalState.removeSubscribe('toolbar');
    }
}
