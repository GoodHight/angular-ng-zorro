import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'paypage',
  templateUrl: './paypage.component.html',
  styleUrls: ['./paypage.component.css']
})
export class PaypageComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.route.params
      .subscribe((params: Params) => {
        this.form = params['form'];
      });
  }
  form: any;
  ngOnInit() {
    // console.log(this.form);
  }

}
