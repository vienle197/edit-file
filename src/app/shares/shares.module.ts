import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFileComponent } from './components/list-file/list-file.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {IconsProviderModule} from '../icons-provider.module';



@NgModule({
  declarations: [
    ListFileComponent
  ],
  exports: [
    ListFileComponent
  ],
  imports: [
    CommonModule,
    NzTableModule,
    NzTagModule,
    IconsProviderModule
  ]
})
export class SharesModule { }
