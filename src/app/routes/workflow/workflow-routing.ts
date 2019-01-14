import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';

const routes: Routes =
    [{
        path: '', component: WorkflowComponent,
        children: [
            {path: 'design', loadChildren: './design/design.module#DesignModule',  data: {title: '设计工作流' }},
            {path: 'task', loadChildren: './task/task.module#TaskModule',  data: {title: '待办事项' }},
            {path: 'template', loadChildren: './templates/template.module#TemplateModule',  data: {title: '工作流模板' }},
            {path: 'work', loadChildren: './work/work.module#WorkModule',  data: {title: '工作' }},
        ]
    }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
