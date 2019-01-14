import { Injectable } from '@angular/core';

@Injectable()
export class FileFlow {
    constructor() {
    }
    /**
     *
     *
     * @param {*} href 文件接口地址
     * @param {*} type 接口类型 默认get 
     * @param {*} token 后端token
     * @returns {*} 返回文件地址
     * @memberof FileFlow
     */
    get(href: any, type: any, token: any, callback) {
        const xmlResquest = new XMLHttpRequest();
        xmlResquest.open(type, href, true);
        xmlResquest.setRequestHeader('Content-type', 'application/json');
        xmlResquest.setRequestHeader('Authorization', token);
        xmlResquest.responseType = 'blob';
        xmlResquest.onload = function (oEvent) {
            // console.log(oEvent);
            const content = xmlResquest.response;
            const blob = new Blob([content]);
            const imgSrc = URL.createObjectURL(blob);
            callback(imgSrc);
        };
        xmlResquest.send();
    }
}
