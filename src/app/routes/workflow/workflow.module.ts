import { NgModule } from '@angular/core';
import { WorkflowRoutingModule } from './workflow-routing';
import { SharedModule } from '@shared/shared.module';
import { WorkflowComponent } from './workflow.component';

@NgModule({
  imports: [
    WorkflowRoutingModule,
    SharedModule,
  ],
  declarations: [WorkflowComponent]
})
export class WorkflowModule { }
