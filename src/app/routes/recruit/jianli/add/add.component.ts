import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService, UploadFile, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { _Validators } from '@delon/util';

@Component({
    selector: 'app-add',
    styleUrls: ['./add.compontent.less'],
    templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {

    form: FormGroup;
    public guid = this.tokenService.get().guid;

    public resumeGuid: any;
    // 文件上传地址
    flieUrl = '';
    // 文件双休绑定
    fileListNotice = [];
    fileList = '';
    fileId: any;
    showImg = true;
    // 设置确定按钮状态
    isLoadingOne = false;
    loading = true;
    // 省
    /*
    * 新增 修改的数据
    * */
    deleteFile = [];
    fileName = '';
    public dataList = {
        name: '',
        phone: '',
        email: '',
        applyPosition: '',
        education: '',
        graduatedFrom: '',
        lastCompany: '',
        userId: this.guid,
        enterpriseId: '',
        fileId: '',
        workYear: '',
        delFileIds: [],
        
    };
    // 文件上传
    public url = environment.SERVER_URL + '/recruit';
    public enterpriseId = this.tokenService.get().loginEid;
    uploaderUrl = environment.UPLOADER_URL + environment.FILE_URL + 'service/files?loginUid=' + this.tokenService.get().guid + '&loginEid=' + this.tokenService.get().guid + '&escrowType=RESUME';
    @ViewChild('fileTemplate') fileTemplate: FileTemplateComponent;

    constructor(private router: Router, private activateRoute: ActivatedRoute, private fb: FormBuilder,
        public msg: NzMessageService, private http: HttpClient, private route: ActivatedRoute,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) { }
 // 文件上传事件
    handleChange(info: { file: UploadFile }): void {
        // console.log(info.file);
        this.fileName = info.file.name;
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.msg.success('上传成功');
            // this.fileId = info.file.response.data;
            this.dataList.fileId = info.file.response.data;
            // console.log(this.dataList);
        }
        if (info.file.status === 'removed') {
            // console.log(info.file);
            if (info.file.guid) {
                if (info.file.guid.fileId) {
                    this.dataList.delFileIds.push(info.file.guid.fileId);
                    this.deleteFile.push(info.file.guid.fileId);
                } else {
                    this.dataList.delFileIds.push(info.file.guid);
                    this.deleteFile.push(info.file.guid);
                }
            } else {
                this.dataList.delFileIds.push(info.file.response.data);
                this.deleteFile.push(info.file.response.data);
            }
        }

    }
    // 上传检查类型
    beforeUpload = (file: File) => {
        // console.log(file.type);
        // console.log(file.name);

        // const ValidationExpression =  new RegExp('^(([a-zA-Z]:)|(//{2}/w+)/$?)(//(/w[/w].*))+(.doc|.DOC|.docx|.DOCX|.pdf|.PDF)$');
        /*  const ValidationExpression =  new RegExp('^(([a-zA-Z]:)|(//{2}/w+)/$?)(//(/w[/w].*))+(.doc|.DOC|.docx|.DOCX|.pdf|.PDF)$');
        if (!ValidationExpression.test(file.name)) {
            this.msg.error('只支持 doc、docx、pdf格式!');
            return false;
        } */
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
            this.msg.error('文件大小不超过20M');
            return false;
        }
      }
    
    _submitForm() {
       
        this.isLoadingOne = true;
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
            // return;
        }
        this.loading = true;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        this.http.post(this.url + '/service/resume', this.dataList, { headers: headers })
            // .map(res => res.json())
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('新增成功', { nzDuration: 3000 });
                    this.loading = false;
                    this.router.navigate(['recruit/resume']);
                } else {
                    this.msg.success(res.message, { nzDuration: 3000 });
                    this.loading = false;
                }

            }, response => {
                // this.error = `账户或密码错误`;
                // console.log('POST call in error', response);
                return;
            });
        
            
    }


    // 取消
    cancel() {
        this.router.navigate(['/recruit']);
    }

    ngOnInit(): void {
        // 获取企业ID
        if (this.tokenService.get().type === 1) {
            this.dataList.enterpriseId = this.tokenService.get().guid;
        } else {
            this.dataList.enterpriseId = this.tokenService.get().userId;
        }
        this.route.params
            .subscribe((params: Params) => {
                return this.resumeGuid = params['guid'];
            });
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            tel: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            email: ['', [Validators.required, Validators.pattern(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/)]],
            applyPosition: [Validators.required],
            education: ['', [Validators.required]],
            graduatedFrom: ['', [Validators.required]],
            workYear: ['', [ Validators.pattern(/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/)]], 
            lastCompany: [''],
        });
    }


}
