import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'auth-page',
  templateUrl: './auth.component.html',
  host: {
    'class': 'absolute inset-0 bg-stone-800 flex px-3'
  }
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
