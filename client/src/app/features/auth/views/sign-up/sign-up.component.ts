import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sign-up-view',
  templateUrl: './sign-up.component.html',
  host: {
    'class': 'flex flex-col'
  }
})
export class SignUpComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
