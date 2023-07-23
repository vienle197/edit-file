import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, startWith, Subject, switchMap, takeUntil} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AppService} from "../services/app.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-your-files',
  templateUrl: './your-files.component.html',
  styleUrls: ['./your-files.component.scss']
})
export class YourFilesComponent implements OnInit , OnDestroy {
  private destroy$: Subject<void> = new Subject<void>()
  listOfData = []
  loading = false
  formSearch: FormGroup
  formPaging = this.fb.group({
    page: [1],
    size: [20]
  })

  constructor(
    private appService: AppService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    this.destroy$.unsubscribe()
  }

  ngOnInit(): void {
    this.formSearch = this.fb.group({
      phone: [localStorage.getItem('phone')]
    })
    this.formPaging.valueChanges
      .pipe(
        startWith(this.formPaging.value),
        takeUntil(this.destroy$),
        switchMap(
          paging => {
            this.loading = true
            return this.appService.getListFilesCustomer({
              ...paging,
              ...this.formSearch.value
            }).pipe(finalize(() => this.loading = false))
          }
        )
      )
      .subscribe(
        res => {
          this.listOfData = res
        },
        e => this.toast.error('Có lỗi xảy ra!')
      )
    this.formSearch.valueChanges.subscribe(() => this.formPaging.patchValue({page: 1}))
  }
}
