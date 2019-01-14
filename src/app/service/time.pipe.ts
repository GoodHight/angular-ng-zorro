import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: string, format: string): any {
    if (!value) {
      return '';
    }
    if (format === 'HH:mm') {
      const h = value.substring(0, 2);
      const m = value.substring(2, 4);
      return h + ':' + m;
    }
    return null;
  }

}
