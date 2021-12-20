import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  host: {
    'class': 'text-stone-700'
  }
})
export class AppComponent { }
