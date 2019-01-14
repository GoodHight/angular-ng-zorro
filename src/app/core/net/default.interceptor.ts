import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse,
    HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent,
    HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { mergeMap, catchError } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

/**
 * 
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        @Inject(DA_SERVICE_TOKEN) private token: ITokenService,
        private router: Router
    ) {

    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        // 正常token值放在请求header当中，具体格式以后端为准
        let header: HttpHeaders = null;
        // token data
        const authData = this.token.get().token;

        // userInfo 干嘛的呢......
        localStorage.setItem('userInfo', '1');


        // console.log('req.url', req.url);
        // console.log('includes all', ( req.url.includes('passport') || req.url.includes('login') || req.url.includes('hrmShortMenu')
        // || req.url.includes('validateUserName') || req.url.includes('notice') 
        // || req.url.includes('assets') || req.url.includes('validateCaptcha') 
        // || req.url.includes('captcha') || req.url.includes('modifyPassword') 
        // || req.url.includes('blockchain2')
        // || req.url.includes('sms') || req.url.includes('email') 
        // || req.url.includes('register')));
        // console.log('includes login', req.url.includes('login'));

        // console.log('YYYYYYYYYYJJJJJJJJJJJJJJJJJJJJYYYYYYYYY', authData);
        if (req.url && !(req.url.includes('passport') || req.url.includes('login')
            || req.url.includes('validateUserName') || req.url.includes('notice')
            || req.url.includes('assets') || req.url.includes('validateCaptcha')
            || req.url.includes('captcha') || req.url.includes('modifyPassword')
            || req.url.includes('blockchain2')
            || req.url.includes('sms') || req.url.includes('email')
            || req.url.includes('register'))) {
            // console.log('YYYYYYYYYYYYYYYYYYY', authData);
            if (!authData || authData.length === 0) {
                setTimeout(() => {
                    // this.router.navigate(['/passport/login', 1], { skipLocationChange: true });
                    this.router.navigateByUrl('/passport/login/1');
                }, 1000);
            }
        } else {
            // console.log('NNNNNNNNNNNNNNNNN');
        }
        // console.log('here---------------');


        if (!(req.url.includes('passport') || req.url.includes('login/') || req.url.includes('register') || req.url.includes('validateCaptcha'))) {
            header = req.headers.set('Authorization', authData);
        }
        // 统一加上服务端前缀
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://') && !req.url.includes('assets')) {
            url = environment.SERVER_URL + url;
        }
        // const loginUid = this.token.get().userGuid;
        // if (loginUid) {
        //     url = url + (url.indexOf('?') > 0 ? '&' : '?') + 'loginUid=' + loginUid + '&loginType=' + this.token.get().type + '&loginPhone=' + this.token.get().userPhone +
        //     '&loginEid=' + this.token.get().loginEid || '' + '&loginMail=' + this.token.get().email;
        // }


        const newReq = req.clone({
            headers: header,
            url: url

        });
        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要\
                if (event instanceof HttpResponse && event.body.message === 'illegal request') {
                    console.log(event);
                    setTimeout(() => {
                        // this.router.navigate(['/passport/login', 1], { skipLocationChange: true });
                        this.router.navigateByUrl('/passport/login/1');
                    }, 1000);
                    return ;    
                }
                if (event instanceof HttpResponse && event.status === 200)
                    return this.handleData(event);
                // 若一切都正常，则后续操作
                return of(event);
            }),
            catchError((err: HttpErrorResponse) => this.handleData(err))
        );
    }

    private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {

        // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
        this.injector.get(_HttpClient).end();
        // 业务处理：一些通用操作
        switch (event.status) {
            case 200:
                // 业务层级错误处理，以下假如响应体的 `status` 若不为 `0` 表示业务级异常
                // 并显示 `error_message` 内容

                // const body: any = event instanceof HttpResponse && event.body;
                // if (body && body.status !== 0) {
                //     this.msg.error(body.error_message);
                //     // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
                //     // this.http.get('/').subscribe() 并不会触发
                //     return ErrorObservable.throw(event);
                // }
                break;
            case 401: // 未登录状态码
                this.token.clear();
                // console.log('401');
                // this.goTo('/passport/login');
                // console.log('here goto login--------------------');

                break;
            case 403:
            case 404:
            case 500:
                // this.goTo(`/${event.status}`);
                break;
        }
        return of(event);
    }

}
