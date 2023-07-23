import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {
  adminPath = environment.adminPath
  isCollapsed = false;

  constructor() { }

  ngOnInit(): void {
  }

}
