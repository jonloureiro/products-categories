import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found.component.html',
  host: {
    'class': 'absolute inset-0 bg-stone-800	flex flex-col px-3'
  }
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
