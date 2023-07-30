import { Component, OnInit } from '@angular/core';
import {AppService} from "../services/app.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  configCkeditor = {
    fullPage: true,
    extraPlugins: 'docprops',
    // Disable content filtering because if you use full page mode, you probably
    // want to  freely enter any HTML content in source mode without any limitations.
    allowedContent: true,
    height: 'calc(100vh - 145px)',
    removeButtons: 'PasteFromWord'
  }

  dataHtml = ''
  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {

  }

}
