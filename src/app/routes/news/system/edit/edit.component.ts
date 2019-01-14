import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, UploadFile, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { GlobalState } from '../../../../service/global.state';
import { isNullOrUndefined } from 'util';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Component({
    selector: 'app-system-edit',
    styleUrls: ['./edit.component.less'],
    templateUrl: './edit.component.html',
})

export class SystemEditComponent implements OnInit {
    public form: FormGroup;
    public submitting = false;
    public submitting1 = false;
    fileList = [];
    fileListNotice = [];
    selectData = [];
    dataList: any;
    initData: any;
    showImg = true;
    isVisibleMiddle = false;
    previewImage = '';
    deleteFile = [];
    public messageTypeOptions = [
        {
            label: '公告信息',
            value: '01'
        }, {
            label: '制度信息',
            value: '02'
        }
    ];

    public selectMessageType = '02'; // 当前选中select
    public title = ''; // 标题
    messageIsTop = false;
    public content = ''; // 当前输入HTML内容页面
    public uuid = ''; // 编辑状态下传递UUID号
    @ViewChild('fileTemplate2') fileTemplate: FileTemplateComponent;

    public config = {
        UEDITOR_HOME_URL: './assets/ueditor/',
        autoClearinitialContent: true,
        autoFloatEnabled: false,
        wordCount: false,
        autoHeightEnabled: false,
        initialFrameHeight: 280,
        elementPathEnabled: false,
        enableAutoSave: false,
        autoSyncData: false,
        saveInterval: 0,
        enableContextMenu: false,
        zIndex: 0,
        sourceEditor: 'textarea',
        toolbars: [[
            'source', '|', 'undo', 'redo', '|',
           'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
           'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
           'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
           'directionalityltr', 'directionalityrtl', 'indent', '|',
           'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase',  'insertimage', 'emotion',   'map', 'template', '|',
           'horizontal', 'date', 'time', 'searchreplace'
         ]]
    };

    previewVisible = false;
    // 部门下面的人员数据
    peopleData = [];
    // 已选的人员数据
    selectPeopleData = [];
    constructor(private router: Router, private activateRoute: ActivatedRoute, private fb: FormBuilder,
        public msg: NzMessageService, private http: HttpClient, private globalState: GlobalState,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.activateRoute.params.subscribe((params) => {
            this.uuid = params['uuid'];
        });
    }
    uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&loginEid=' + this.tokenService.get().guid + '&escrowType=NOTICE_FILES';
    uploaderCoverUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&loginEid=' + this.tokenService.get().guid + '&escrowType=NOTICE_COVER';
    public files_url = environment.UPLOADER_URL + environment.FILE_URL;
    // 部门人员缓存对象, 用于选择人员;
    deptEmployeeMap = {};
    ngOnInit() {
        this.loadingfing();
    }


    loadingfing() {
        if (this.uuid && this.uuid.length > 0) {
            this.http.get(environment.NOTICE_URL + 'service/notice/' + this.uuid).subscribe((res: any) => {
                if (res.code === 0) {
                    this.title = res.data.title;
                    this.content = res.data.content;
                    // this.messageIsTop = res.data.isTop + '';
                    this.messageIsTop = res.data.isTop === 0 ? false : true;
                    this.selectData = res.data.publishTo;
                    this.getmultiplexing();
                    if (res.data.noticeCover !== '') {
                        const obj = {
                            uid: -1,
                            name: 'xxx.png',
                            status: 'done',
                            url: this.files_url + 'service/files/' + res.data.noticeCover,
                            guid: res.data.noticeCover
                        };
                        this.fileList.push(obj);
                    }
                    if (res.data.noticeFiles !== '') {
                        res.data.noticeFiles.forEach((value, key) => {
                            const obj1 = {
                                uid: '1001' + key,
                                name: value.fileName,
                                status: 'done',
                                url: environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + value.fileId,
                                guid: value.fileId,
                                response: '{"status": "success"}'
                            };
                            this.fileListNotice.push(obj1);
                        });
                    }
                    // console.log(this.fileListNotice);
                } else {
                    this.msg.error(res.message);
                    this.getmultiplexing();
                }
            }, response => {
                this.getmultiplexing();
            });

        }
        this.form = this.fb.group({
            title: [this.title, [Validators.required]],
            content: [this.content],
            messageType: [this.selectMessageType],
            // messageIsTop: [this.messageIsTop]
        });
    }


    getmultiplexing() {
        this.http.get(environment.ENTERPRISE_URL + 'service/employee/enterprise?enterpriseGuid=' + this.tokenService.get().guid).subscribe((res: any) => {
            if (res.code === 0) {
                if (this.selectData.length > 0) {
                    this.selectData.forEach(value => {
                        res.data.forEach(element => {
                            if (value === element.employeeGuid) {
                                element.checked = true;
                                element.guid = element.employeeGuid;
                                this.selectPeopleData.push(element);
                            }
                        });
                    });
                }

            }
        });
    }

    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    // 上傳的監控
    handleChange(info: { file: UploadFile }, type): void {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.msg.success('上传成功');
            const length = this.fileListNotice.length;
            if (type === 1) {
                // fileListNotice
                this.fileListNotice[length - 1].thumbUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/' + info.file.response.data;

            }
        }
        if (info.file.status === 'removed') {
            if (info.file.guid) {
                if (info.file.guid.fileId) {
                    this.deleteFile.push(info.file.guid.fileId);
                } else {
                    this.deleteFile.push(info.file.guid);
                }
            } else {
                this.deleteFile.push(info.file.response.data);
            }
            // this.deleteFile.push(info.file.response.data);
        }
    }
    public submit(type: any) {

        if (this.selectData.length === 0) {
            this.msg.error('请选择人员范围');
            return;
        }
        if (this.form.controls.title.value === '') {
            this.msg.error('请输入标题');
            return;
        }

        if (this.content === '') {
            this.msg.error('请输入正文');
            return;
        }
        if (type === 1) {
            this.submitting1 = true;
        } else {
            this.submitting = true;
        }
        const body = {
            'enterpriseId': this.tokenService.get().guid,
            'guid': this.uuid,
            'title': this.form.controls.title.value,
            'content': this.content,
            'publishTo': this.selectData,
            // 'isTop': this.form.controls.messageIsTop.value ? 1 : 0,
            'isTop': this.messageIsTop ? 1 : 0,
            'fileIds': [],
            'publishState': type,
            'userId': this.tokenService.get().guid,
            'delFileIds': this.deleteFile
        };
        let filsId;
        if (this.fileList.length > 0) {
            if (!this.fileList[0].response) {
                const hreflen = this.fileList[0].url.length;
                filsId = this.fileList[0].url.substr((hreflen - 18), 18);
            } else {
                filsId = this.fileList[0].response.data;
            }
        }
        if (!filsId) {
            body.fileIds = [];
        } else {
            body.fileIds.push(filsId);
        }
        this.fileListNotice.forEach(value => {
            let filsIds = '';
            if (!value.response) {
                const hreflen = this.fileList[0].url.length;
                filsIds = value.url.substr((hreflen - 18), 18);
            } else {
                filsIds = value.response.data;
            }

            body.fileIds.push(filsIds);
        });
        let propsUrl = this.http.post(environment.NOTICE_URL + 'service/notice/2', body);
        if (this.uuid && this.uuid.length > 0) {
            propsUrl = this.http.patch(environment.NOTICE_URL + 'service/notice/2/' + this.uuid, body);
        }
        propsUrl.subscribe((res: any) => {
            if (res.code === 0) {
                if (this.activateRoute.routeConfig.path === 'add') {
                    this.msg.success('新增成功');
                } else {
                    this.msg.success('修改成功');
                }
                this.submitting = false;
                this.router.navigate(['/news/system/index']);
            } else {
                this.msg.error(res.message);
            }
        }, response => {

        });
    }

    public back() {
        this.router.navigate(['/news/system/index']);
    }
    // updateAllChecked(guid): void {
    //     const getGuid = guid;
    //     if (this.selectData.length > 0) {
    //         if (this.isInArray3(this.selectData, getGuid)) {
    //             this.selectData.splice(this.selectData.indexOf(getGuid), 1);
    //             let indexs = -1;
    //             this.selectPeopleData.forEach((value, i) => {
    //                 if (guid === value.guid) {
    //                     indexs = i;
    //                 }
    //             });
    //             this.selectPeopleData.splice(indexs, 1);
    //         } else {
    //             this.selectData.push(getGuid);
    //         }
    //     } else {
    //         this.selectData.push(getGuid);
    //     }
    // }
    getChecked(index): void {
        const getGuid = this.peopleData[index].guid;
        const selectPeopleData = this.selectPeopleData;
        let flag = true;
        if (selectPeopleData.length > 0) {
            selectPeopleData.forEach((value, key) => {
                if (getGuid === value.guid && flag) {
                    selectPeopleData.splice(key, 1);
                    this.selectData.splice(key, 1);
                    return flag = false;
                }
            });
            if (flag) {
                selectPeopleData.push(this.peopleData[index]);
                this.selectData.push(getGuid);
            }
        } else {
            selectPeopleData.push(this.peopleData[index]);
            this.selectData.push(getGuid);
        }
    }
    handleOkMiddle(): void {
        this.isVisibleMiddle = false;
    }
    showModel() {
        this.isVisibleMiddle = true;
        this.http.get(environment.ENTERPRISE_URL + 'service/enterprise/dept/employee?enterpriseGuid=' + this.tokenService.get().guid)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.initData = res.data;
                    this.dataList = [new NzTreeNode(res.data)];
                    // 添加缓存
                    this.convertToEmployee(res.data);
                } else {
                    this.msg.error(res.message);
                }
                // this.isVisibleMiddle = false;
            });

    }

    convertToEmployee(root: any): void {
        this.convert2Employee(root);
        let v = [];
        for (const key in this.deptEmployeeMap) {
            if (this.deptEmployeeMap.hasOwnProperty(key)) {
                const element = this.deptEmployeeMap[key];
                v = v.concat(element);
            }
        }
        this.deptEmployeeMap[root.key] = v;
    }

    convert2Employee(department: any): void {
        const total = [].concat(department.employees);
        if (department.children.length > 0) {
            for (let i = 0; i < department.children.length; i++) {
                this.convert2Employee(department.children[i]);
            }
        }
        this.deptEmployeeMap[department.key] = total;
        // // console.log('--dept---', department.key, department.title, total);
    }

    /**
     * 使用indexOf判断元素是否存在于数组中
     * @param {Object} arr 数组
     * @param {Object} value 元素值
     */
    isInArray3(arr, value) {
        if (arr.indexOf && typeof (arr.indexOf) === 'function') {
            const index = arr.indexOf(value);
            if (index >= 0) {
                return true;
            }
        }
        return false;
    }

    handleCancelMiddle(): void {
        this.isVisibleMiddle = false;

    }
    mouseAction(name: string, event: NzFormatEmitEvent): void {
        if (this.uuid && this.uuid.length > 0) {
            this.peopleData = []; // 
            this.peopleData = this.deptEmployeeMap[event.node.key] || [];
            if (this.selectData.length > 0) {
                this.selectData.forEach(value => {
                    this.peopleData.forEach(element => {
                        if (value === element.guid) {
                            element.checked = true;
                        }
                    });
                });
            }
        } else {
            this.peopleData = [];
            this.peopleData = this.deptEmployeeMap[event.node.key] || [];
        }
    }
    onClose(index): void {
        this.peopleData.splice(index, 1);
        this.selectData.splice(index, 1);
    }
    /* 
   下载附件
   */
    down(file: UploadFile) {
        location.href = environment.UPLOADER_URL + environment.FILE_URL + 'service/files/download/' + file.guid;
    }
    // 隐藏图片
    displayImg() {
        this.showImg = false;
    }
    // 刪除圖片
    deleteImge(index) {
        this.deleteFile.push(this.fileListNotice[index].guid);
        this.fileListNotice.splice(index, 1);
    }

}
