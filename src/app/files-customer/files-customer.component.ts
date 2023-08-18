import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../services/app.service";
import {ToastrService} from "ngx-toastr";
import {finalize, of, startWith, Subject, switchMap, takeUntil} from 'rxjs';
import {CKEditorComponent} from "ckeditor4-angular";
import {environment} from "../../environments/environment";
import {simplifyFraction} from "../helpers/math-helper";
import {Router} from "@angular/router";

@Component({
  selector: 'app-files-customer',
  templateUrl: './files-customer.component.html',
  styleUrls: ['./files-customer.component.scss']
})
export class FilesCustomerComponent implements OnInit, OnDestroy {
  urlBE = environment.api
  private destroy$: Subject<void> = new Subject<void>()
  listOfData = []
  loading = false
  gettingFile = false
  formSearch: FormGroup
  formPaging = this.fb.group({
    page: [1],
    size: [20]
  })
  numberItems = 6
  isVisibleUpload: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setNumberItems()
  }

  handleCancel(): void {
    this.isVisibleUpload = false;
  }
  constructor(
    private appService: AppService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) { }
  setNumberItems() {
    if(window.innerWidth < 300) {
      this.numberItems = 1
    } else if (window.innerWidth < 500) {
      this.numberItems = 2
    } else if (window.innerWidth < 700) {
      this.numberItems = 3
    } else if (window.innerWidth < 900) {
      this.numberItems = 4
    } else {
      this.numberItems = 6
    }
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    this.destroy$.unsubscribe()
  }

  ngOnInit(): void {
    this.setNumberItems()
    this.formSearch = this.fb.group({
    })
    this.formPaging.valueChanges
      .pipe(
        startWith(this.formPaging.value),
        takeUntil(this.destroy$),
        switchMap(
          paging => {
            this.loading = true
            return this.appService.getListFiles({
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
        e => {
          this.toast.error('Có lỗi xảy ra!')
          console.error(e)
        }
      )
  }
}
