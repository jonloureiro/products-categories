import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.component.html',
  host: {
    'class': 'absolute inset-0 bg-stone-200 flex flex-col'
  }
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
