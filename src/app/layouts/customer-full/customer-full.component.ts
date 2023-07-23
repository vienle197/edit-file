import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-customer-full',
  templateUrl: './customer-full.component.html',
  styleUrls: ['./customer-full.component.scss']
})
export class CustomerFullComponent implements OnInit {
  constructor(private activateRoute: ActivatedRoute) { }
  get pathActive() {
    return window.location.pathname
  }
  ngOnInit(): void {
    // console.log(this.activateRoute)
  }

}
