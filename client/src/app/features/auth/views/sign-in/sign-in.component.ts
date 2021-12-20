import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sign-in-veiw',
  templateUrl: './sign-in.component.html',
  host: {
    'class': 'flex flex-col'
  }
})
export class SignInComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
