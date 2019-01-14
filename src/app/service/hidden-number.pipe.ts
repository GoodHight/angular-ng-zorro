import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hiddenNumber'
})
export class HiddenNumberPipe implements PipeTransform {

  transform(value: any, showNumber?: number): any {
    const len = value.length - showNumber * 2;
    let star = '';
    for (let i = 0; i < len; i++) {
      star += '*';
    }
    return value.substring(0, showNumber) + star + value.substring(value.length - showNumber);
  }
}
