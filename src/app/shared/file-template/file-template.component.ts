import {Component, Input, Output, Inject, OnInit, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {environment} from '@env/environment';
import {ITokenService, DA_SERVICE_TOKEN} from '@delon/auth';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'file-template',
    styleUrls: ['./file-template.component.less'],
    templateUrl: './file-template.component.html',
})

export class FileTemplateComponent implements OnInit, OnDestroy {

    public loading = false;
    public fileTemplateMap: Map<string, any[]> = new Map<string, any[]>();

    public postUrl: any =  + 'service/file';
    public fileTemplates = [];

    @Input() bizType: string; // 业务类型
    @Input() bizID: string;   // 业务ID
    @Input() showFileAttachmentURI = false;  // 显示附件地址
    @Output() ready = false;
    @Output() updataFileID: Map<string, string> = new Map<string, string>();
    private service: any;

    constructor(private msg: NzMessageService, private http: HttpClient,
                @Inject(DA_SERVICE_TOKEN) service: ITokenService) {
        this.service = service;
    }


    ngOnInit() {
        if (!!!this.bizType) {
            this.msg.error('获取模板错误，没有设置业务类型!');
            return;
        }
        // 加载模板信息
        this.loadTemplate();
    }

    ngOnDestroy() {
        this.fileTemplateMap.clear();
        this.updataFileID.clear();
    }

    getUploadParams(fileTemplate: any) {
        return '?escrowGuid=' + fileTemplate.guid + '&escrowEntity=' + fileTemplate.tagBusinessType + '&escrowModel=' + fileTemplate.tagBusinessType +
            '&isTemplate=0';
    }

    dataFun = (fileTemplate: any, file: UploadFile) => {
        return {
            escrowGuid: fileTemplate.guid,
            escrowEntity: fileTemplate.tagBusinessType,
            escrowModel: fileTemplate.tagBusinessType
        };
    }

    private preview(filetype: string, templateID: string, fileID: string, file: any, fileListObj: any) {
        if (filetype.includes('image/png') || filetype.includes('image/jpeg')) {
            this.fileTemplateMap.set(templateID, [{
                uid: fileID,
                name: file.name,
                status: 'done',
                url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token,
                data_url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token
            }]);
            file.uid = fileID;
            file.thumbUrl = environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token;
            fileListObj.thumbUrl = file.thumbUrl;
            fileListObj.uid = file.uid;
            fileListObj.originFileObj = file.uid;
        } else if (filetype.includes('application/pdf')) {
            this.fileTemplateMap.set(templateID, [{
                uid: fileID,
                name: file.name,
                status: 'done',
                url: './assets/img/template/pdf.png',
                data_url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token
            }]);
            file.uid = fileID;
            file.thumbUrl = './assets/img/template/pdf.png';
            fileListObj.thumbUrl = file.thumbUrl;
            fileListObj.uid = file.uid;
            fileListObj.originFileObj = file.uid;
        } else if (filetype.includes('aplication/zip')) {
            this.fileTemplateMap.set(templateID, [{
                uid: fileID,
                name: file.name,
                status: 'done',
                url: './assets/img/template/zip.png',
                data_url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token
            }]);
            file.uid = fileID;
            file.thumbUrl = './assets/img/template/zip.png';
            fileListObj.thumbUrl = file.thumbUrl;
            fileListObj.uid = file.uid;
            fileListObj.originFileObj = file.uid;
        } else if (filetype.includes('application/vnd.ms-excel')) {
            this.fileTemplateMap.set(templateID, [{
                uid: fileID,
                name: file.name,
                status: 'done',
                url: './assets/img/template/execl.png',
                data_url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token
            }]);
            file.uid = fileID;
            file.thumbUrl = './assets/img/template/execl.png';
            fileListObj.thumbUrl = file.thumbUrl;
            fileListObj.uid = file.uid;
            fileListObj.originFileObj = file.uid;
        } else if (filetype.includes('application/vnd.ms-powerpoint')) {
            this.fileTemplateMap.set(templateID, [{
                uid: fileID,
                name: file.name,
                status: 'done',
                url: './assets/img/template/ppt.png',
                data_url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token
            }]);
            file.uid = fileID;
            file.thumbUrl = './assets/img/template/ppt.png';
            fileListObj.thumbUrl = file.thumbUrl;
            fileListObj.uid = file.uid;
            fileListObj.originFileObj = file.uid;
        } else if (filetype.includes('application/msword')) {
            this.fileTemplateMap.set(templateID, [{
                uid: fileID,
                name: file.name,
                status: 'done',
                url: './assets/img/template/word.png',
                data_url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token
            }]);
            file.uid = fileID;
            file.thumbUrl = './assets/img/template/word.png';
            fileListObj.thumbUrl = file.thumbUrl;
            fileListObj.uid = file.uid;
            fileListObj.originFileObj = file.uid;
        } else if (filetype.includes('error')) {
            this.fileTemplateMap.set(templateID, [{
                uid: fileID,
                name: file.name,
                status: 'done',
                url: './assets/img/template/error.png',
                data_url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token
            }]);
            file.uid = fileID;
            file.thumbUrl = './assets/img/template/error.png';
            fileListObj.thumbUrl = file.thumbUrl;
            fileListObj.uid = file.uid;
            fileListObj.originFileObj = file.uid;
        } else {
            this.fileTemplateMap.set(templateID, [{
                uid: fileID,
                name: file.name,
                status: 'done',
                url: './assets/img/template/other.png',
                data_url: environment.SERVER_URL + this.postUrl + '/' + fileID
                + '?access_token=' + this.service.get().token
            }]);
            file.uid = fileID;
            file.thumbUrl = './assets/img/template/other.png';
            fileListObj.thumbUrl = file.thumbUrl;
            fileListObj.uid = file.uid;
            fileListObj.originFileObj = file.uid;
        }
    }

    private loadTemplate() {
        // 获取模板信息
        this.http.get(environment.UPLOADER_URL + environment.FILE_URL + 'service/file/' + this.bizType).subscribe((res: any) => {
            if (res.code === 1) {
                this.fileTemplates = res.data;
                this.ready = true;
            } else {
                this.msg.error(res.message);
                this.ready = false;
            }
        }, response => {
            this.fileTemplates = [];
            this.ready = false;
        });

        // 根据业务ID获取当前模板对应业务ID
        if (!isNullOrUndefined(this.bizID)) {
            this.http.get(environment.FRAMEWORK_URL + 'service/file/detail/' + this.bizID).subscribe((res: any) => {
                if (res.code === 1) {
                    res.data.forEach((val) => {
                        this.fileTemplateMap.set(val.escrowGuid, [{
                            uid: val.guid,
                            name: val.fileName,
                            status: 'done',
                            templateID: val.escrowGuid,
                            url: environment.SERVER_URL + this.postUrl + '/' + val.guid
                            + '?access_token=' + this.service.get().token,
                            data_url: environment.SERVER_URL + this.postUrl + '/' + val.guid
                            + '?access_token=' + this.service.get().token
                        }]);
                        this.updataFileID.set(val.escrowGuid, val.guid);
                    });
                } else {
                    this.msg.error(res.message);
                }
            }, response => {

            });
        }
    }

    private handleChange(fileTemplate: any, event: any): void {
        if (event.file.status === 'uploading') {
            this.updataFileID.delete(fileTemplate.guid);
            this.fileTemplateMap.delete(fileTemplate.guid);
            this.loading = true;
            return;
        } else if (event.file.status === 'done') {
            this.fileTemplateMap.delete(fileTemplate.guid);
            const res = event.file.response;
            if (res.code === 1) {
                this.updataFileID.set(fileTemplate.guid, res.data);
                const filetype = event.file.type;
                this.preview(filetype, fileTemplate.guid, res.data, event.file, event.fileList[0]);
                this.loading = false;
                return;
            } else {
                this.msg.error('上传文件失败，请重试');
            }
            this.updataFileID.delete(fileTemplate.guid);
            this.fileTemplateMap.delete(fileTemplate.guid);
            this.loading = false;
        } else if (event.file.status === 'removed') {
            const params = new HttpParams().set('fileIds', event.file.uid);
            this.http.delete(environment.FRAMEWORK_URL + 'service/file', {params: params}).subscribe((res: any) => {
                if (res.code === 1) {
                    this.updataFileID.delete(fileTemplate.guid);
                    this.fileTemplateMap.delete(fileTemplate.guid);
                } else {
                    this.msg.error(res.message);
                }
            }, response => {

            });
        }
    }

}
