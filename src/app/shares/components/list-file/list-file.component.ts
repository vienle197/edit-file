import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {finalize} from 'rxjs';
import {AppService} from '../../../services/app.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-list-file',
  templateUrl: './list-file.component.html',
  styleUrls: ['./list-file.component.scss']
})
export class ListFileComponent implements OnInit {
  @Input() listOfData: any[] = []
  @Input() loading = false
  @Input() allowRemove = false
  @Output() onRemoved: EventEmitter<boolean> = new EventEmitter<boolean>()
  urlBE = environment.api
  constructor(
    private appService: AppService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }

  removeFile(data: any) {
    if(data.removing) return
    data.removing = true
    this.appService.removeFile(data.id)
      .pipe(finalize(() => data.removing = false))
      .subscribe(
        res => {
          this.onRemoved.next(true)
          this.toast.success('Xoá file thành công!')
        },
        e => this.toast.error('Xoá file thất bại!')
      )
  }
}
