import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';
@Component({
    selector: 'one',
    templateUrl: './one.component.html',
    styleUrls: ['./one.component.less']
})
export class OneComponent implements OnInit {
    validateForm: FormGroup;
    url = environment.SERVER_URL + environment.USER_URL;
    readonly = false;
    current = 0;
    constructor(private fb: FormBuilder, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private http: HttpClient, private msg: NzMessageService, private router: Router) {
    }

    submitForm() {
        this.http.patch(this.url + 'service/user/l0/' + this.tokenService.get().guid, this.validateForm.value)
            .subscribe((res: any) => {
                if (res.code === 0) {
                    this.msg.success(res.message);
                    this.current = 1;
                } else {
                    this.msg.error(res.message);
                }
            });
    }

    ngOnInit() {
        if (this.tokenService.get().idNumber.length > 15) {
            this.readonly = true;
        }
        this.validateForm = this.fb.group({
            idCardNumber: [this.tokenService.get().idNumber, [Validators.required]],
            realName: [this.tokenService.get().name, [Validators.required]],
        });
    }


}
