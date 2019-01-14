import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'dateTrans', pure: false})
export class DateTransPipe implements PipeTransform {
    constructor() {
    }
    transform(value: string, format: string): any {
        const date = value;
        if ((!!date) && date.length === 14) {
            const year = date.substr(0, 4);
            const month = date.substr(4, 2);
            const day = date.substr(6, 2);
            const hour = date.substr(8, 2);
            const minute = date.substr(10, 2);
            const second = date.substr(12, 2);
            if (format === 'YYYY-MM-dd HH:mm') {
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            } else if (format === 'YYYY年MM月dd日 HH:mm') {
                return year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
            } else if (format === 'YYYY年MM月dd日 HH:mm:ss') {
                return year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second;
            } else if (format === 'YYYY年MM月dd日') {
                return year + '年' + month + '月' + day + '日';
            } else if (format === 'YYYY年MM月') {
                return year + '年' + month + '月';
            } else if (format === 'YYYY-MM-dd HH:mm') {
                return year + '-' + month + '' + day + ' ' + hour + ':' + minute;
            } else if (format === 'YYYY-MM-dd HH:mm:ss') {
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            } else if (format === 'YYYY-MM') {
                return year + '-' + month;
            } else if (format === 'YYYY-MM-dd') {
                return year + '-' + month + '-' + day;
            } else if (format === 'HH:mm:ss') {
                return hour + ':' + minute + ':' + second;
            } else if (format === 'HH:mm') {
                return hour + ':' + minute;
            } else {
                return year + month + day + hour + minute + second;
            }
        }
        if ((!!date) && date.length === 8) {
            const year = date.substr(0, 4);
            const month = date.substr(4, 2);
            const day = date.substr(6, 2);

            if (format === 'YYYY-MM-dd') {
                return year + '-' + month + '-' + day;
            }  else if (format === 'YYYY年MM月dd日') {
                return year + '年' + month + '月' + day + '日';
            } else if (format === 'YYYY年MM月') {
                return year + '年' + month + '月';
            } else if (format === 'YYYY-MM') {
                return year + '-' + month;
            } else if (format === 'YYYY-MM-dd') {
                return year + '-' + month + '-' + day;
            } else {
                return year + month + day ;
            }
        }
        if ((!!date) && date.length === 6) {
            const hour = date.substr(0, 2);
            const minute = date.substr(2, 2);
            const second = date.substr(4, 2);
            if (format === 'HH:mm:ss') {
                return hour + ':' + minute + ':' + second;
            } else if (format === 'HH:mm') {
                return hour + ':' + minute;
            } else {
                return hour + minute + second;
            }
        }
        return date;
    }

}
