import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {

    constructor(
    ) { }

    ngOnInit() {
      window.open('https://talust.com/cly/help/enterprise/Instructions-Problem.html');
    }

}
