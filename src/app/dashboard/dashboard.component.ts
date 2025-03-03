import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: string = 'User';

  constructor() { }

  ngOnInit(): void {
    // You can get the username from your authentication service here
  }
}
