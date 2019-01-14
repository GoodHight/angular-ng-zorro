import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '@env/environment';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})

export class MessageDetailComponent implements OnInit {
  /* 参数获取 判断是详情、新增、修改 邮件详情页 请求不同接口，guid token中获取 ， 返回数据初始化化，填充，修改完成：详情应该只有返回按钮？ 新增和修改分别有保存取消按钮？*/
    form: FormGroup;
    userId: '';
    enterpriseId: '';
    public guid: any; // 参数获取
    public category: any; // 参数获取
    public templateType: any; // 参数获取
    public act: any = 'watch'; // 参数获取
    public url = environment.SERVER_URL + '/recruit'; // 请求环境路径
    public selectCategory: any ; // 模板类型的选择
    public templateName = '';
    public title = '';
    // public templateTypeList = [{category: 1, categoryDesc: 'offer邮件' }, {category: 2, categoryDesc: '面试邮件' }];
    public templateTypeList: any;
    public content = '';
    public isLoadingOne: Boolean = false;

    // ueditor配置
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

    ngOnInit(): void {
        if (this.act === 'new') {
            this.newGetData( this.category, this.templateType);
         } else {
            this.getData();
         }
        this.form = this.fb.group({
            templateName: ['', [Validators.required]],
            selectCategory: ['', [Validators.required]],
            content: ['', [Validators.required]],
            // messageContent: ['', [Validators.required]],
        });
        this.enterpriseId = this.reuseTabService.get().guid;
        if (this.tokenService.get().type === 1) {
            this.userId = this.tokenService.get().guid;
        } else {
            this.userId = this.tokenService.get().userId;
        }
    }

    constructor(private http: HttpClient,
        private fb: FormBuilder, private msg: NzMessageService, private router: Router,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private route: ActivatedRoute, @Inject(DA_SERVICE_TOKEN) private reuseTabService: ITokenService) {
        this.route.params
            .subscribe((params: Params) => {
                  this.category = params['category'];
                  this.templateType = params['templateType'];
                  this.guid = params['guid'];
                  this.act = params['action'];
                  // list 显示判断
                  if (this.templateType === '1') {
                    this.templateTypeList = [{category: '1-1', categoryDesc: 'offer短信' }, {category: '2-1', categoryDesc: '面试短信' }];
                  }
                  if (this.templateType === '2') {
                    this.templateTypeList = [{category: '1-2', categoryDesc: 'offer邮件' }, {category: '2-2', categoryDesc: '面试邮件' }];
                  }
                  this.selectCategory = this.category + '-' + this.templateType;
                  return ;
            });
    }

    // 获取树形图的内容
    getData() {
      const loginEid = this.reuseTabService.get().guid;
    //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
    //   this.http.get(this.url + '/service/recruitSettingTemplate/', { params: { guid : this.guid, type : this.templateType}})
    this.http.get(this.url + '/service/recruitSettingTemplate/' + this.templateType + '/' + this.guid)
          .subscribe((res: any) => {
              if (res.code === 0) {
                  this.title = res.data.title;
                  this.content = res.data.content;
                  this.templateName =  res.data.templateName;
              } else {
                  this.msg.error('没有数据');
              }
          }, response => {
              // console.log('服务器错误');
              return;
          });
    }
    // 新增 初始获取系统模板
    newGetData(category, type) {
        //   const enterpriseId = this.reuseTabService.get().guid;
      //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
          this.http.get(this.url + '/service/recruitSettingTemplate/getSystemDetail/' + category + '/' + type)
          .subscribe((res: any) => {
                if (res.code === 0) {
                    this.title = res.data.title;
                    this.content = res.data.content;
                    this.templateName =  res.data.templateName;
                } else {
                    this.msg.error('没有数据');
                }
            }, response => {
                // console.log('服务器错误');
                return;
            });
    }
    // 选择列表
    listTypeChange(e) {
        const par = e;
        const arr = par.split('-');
        const category = arr[0];
        const type = arr[1];
        if (this.act === 'new') {
            this.newGetData(category, type);
        } else {
            this.getData();
        }
    }
    // 取消返回
    cancel() {
        this.router.navigate(['/recruit/notification']);
    }
    // 确定提交按钮
    _submitForm() {
        this.isLoadingOne = true;
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
            // return;
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const obj = this.form.value;
        // console.log(obj);
        //  obj['enterpriseId'] = this.tokenService.get().guid;
        const arr = this.selectCategory.split('-'); 
        obj['templateCategory'] = arr[0];
        obj['templateType'] = arr[1];
        obj['enterpriseId'] = this.enterpriseId;
        obj['userId'] = this.userId;
         // console.log(obj);
         let requestUrl: any;
         if (this.act === 'new') {
             // 新增
            requestUrl = this.http.post(this.url + '/service/recruitSettingTemplate',  obj, { headers: headers });
         } else if (this.act === 'edit') {
             // 修改
            requestUrl = this.http.patch(this.url + '/service/recruitSettingTemplate/' + this.guid,  obj, { headers: headers });
         }
         requestUrl.subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success('提交成功', { nzDuration: 3000 });
                    this.router.navigate(['/recruit/notification']);
                } else {
                    this.isLoadingOne = false;
                    this.msg.error(res.message, { nzDuration: 1000 });
                }
            }, response => {
                this.isLoadingOne = false;
                this.msg.error('服务器错误');
                return;
            });
    }
    
}

