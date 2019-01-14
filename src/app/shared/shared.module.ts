import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { UEditorModule } from 'ngx-ueditor';
import { FileTemplateComponent } from '@shared/file-template/file-template.component';
import { SortablejsModule } from 'angular-sortablejs/dist';

import { LalustSelectPersonComponent } from '../custom/lalust-select-person/lalust-select-person.component';
import { LalustSelectDeptComponent } from '../custom/lalust-select-dept/lalust-select-dept.component';
import { LalustSelectPersonSingleComponent } from '../custom/lalust-select-person-single/lalust-select-person-single.component';


// import { Md5 } from 'ts-md5/dist/md5';
// import { NzSchemaFormModule } from 'nz-schema-form';
const THIRDMODULES = [
    NgZorroAntdModule,
    CountdownModule,
    UEditorModule,
    // Md5
    // NzSchemaFormModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [
    FileTemplateComponent,
    LalustSelectPersonComponent,
    LalustSelectDeptComponent,
    LalustSelectPersonSingleComponent
];
const DIRECTIVES = [];
// endregion

@NgModule({
    imports: [
    CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AlainThemeModule.forChild(),
        DelonABCModule,
        DelonACLModule,
        SortablejsModule,
        // third libs
        ...THIRDMODULES
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AlainThemeModule,
        DelonABCModule,
        DelonACLModule,
        // i18n
        TranslateModule,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ]
})
export class SharedModule { }
