import { NgModule } from '@angular/core';
import { DateTransPipe } from './dateTrans.pipe';
import { HiddenNumberPipe } from './hidden-number.pipe';
import { TimePipe } from './time.pipe';

const COMPONENTS = [
    DateTransPipe,
    HiddenNumberPipe
];

@NgModule({
   imports: [],
   declarations: [
      ...COMPONENTS,
      TimePipe
   ],
   exports: [
      ...COMPONENTS,
      TimePipe
   ]
})

export class ServiceModule {}
