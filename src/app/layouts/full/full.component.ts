import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";
import {AppService} from "../../services/app.service";

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {
  adminPath = environment.adminPath
  isCollapsed = false;
  user

  constructor(
    private _appService: AppService,
  ) {
    _appService.getUserProfile().subscribe(
      u => this.user = u
    )
  }

  ngOnInit(): void {
  }

  logout() {
    localStorage.clear()
    window.location.assign( '/' + this.adminPath + '/login')
  }
}
