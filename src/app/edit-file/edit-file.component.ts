import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {simplifyFraction} from '../helpers/math-helper';
import {finalize, Subject} from 'rxjs';
import {CKEditorComponent} from 'ckeditor4-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {AppService} from '../services/app.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.scss']
})
export class EditFileComponent implements OnInit, AfterViewInit {
  private destroy$: Subject<void> = new Subject<void>()
  @ViewChild('editor1') editor1: CKEditorComponent
  formInfo = this.fb.group({
    phone: [localStorage.getItem('phone'), [Validators.required]],
    // file: [null, [Validators.required]],
    width: [0, [Validators.required, Validators.min(1)]],
    height: [0, [Validators.required, Validators.min(1)]],
  })
  dimension = {
    width: 0,
    height: 0
  }
  dataHtml = ''
  fileInfo
  uploading = false
  configCkeditor = {
    fullPage: true,
    // extraPlugins: 'docprops',
    // colorButton_enableAutomatic: true,
    allowedContent: true,
    height: 'height: calc(100vh - 15rem);',
    removeButtons: 'PasteFromWord',
    contentsCss: '/assets/styles/ckeditor.css',
    toolbar: [
      [ 'Undo', 'Redo' ],
      [ 'TextColor' ],
      [ 'Font', 'FontSize' ]
    ]
  }
  constructor(
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private appService: AppService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.fileInfo = this.activateRoute.snapshot.data.fileDetail.info
    const res = this.activateRoute.snapshot.data.fileDetail.content
    const parser = new DOMParser();
    const doc = parser.parseFromString(res, 'text/html');
    const newScss = document.createElement('style')
    newScss.textContent = "#page-container div.t {\n" +
      "    border: 10px solid #1890ff;\n" +
      "  }"
    newScss.setAttribute('id', 'mark-editor')
    doc.querySelector('head').append(newScss);
    this.dataHtml = new XMLSerializer().serializeToString(doc);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.setDimensionDefault()
    }, 100)
  }

  initForm() {
    this.formInfo.get('width').valueChanges.subscribe(
      w => {
        this.formInfo.get('height').patchValue(Math.round(w * (this.dimension.height / this.dimension.width)), {emitEvent: false})
      }
    )
    this.formInfo.get('height').valueChanges.subscribe(
      h => {
        this.formInfo.get('width').patchValue(Math.round(h * (this.dimension.width / this.dimension.height)), {emitEvent: false})
      }
    )
  }

  setDimensionDefault() {
    try {
      const iframe = document.querySelector('ckeditor iframe') as HTMLIFrameElement
      const pageRef = iframe?.contentDocument?.querySelector('#page-container div')
      const x = simplifyFraction(pageRef.clientWidth, pageRef.clientHeight)
      this.dimension = {
        width: x[0],
        height: x[1],
      }
      // this.formInfo.patchValue(this.dimension, {emitEvent: false})
    } catch (e) {
      setTimeout(() => {
        this.setDimensionDefault()
      }, 100)
    }
  }



  submitFile() {
    if(this.formInfo.invalid) {
      this.formInfo.markAllAsTouched()
      return
    }
    this.uploading = true
    const content = this.editor1.data
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    doc.querySelector('#mark-editor').remove()
    const pdfBlob = new Blob([new XMLSerializer().serializeToString(doc)], { type: 'application/html' });
    const formData = new FormData()
    formData.append('file', pdfBlob)
    formData.append('name', `${this.fileInfo.name}-${this.formInfo.value.phone}`)
    formData.append('phone', this.formInfo.value.phone)
    formData.append('height', `${this.formInfo.value.height}`)
    formData.append('width', `${this.formInfo.value.width}`)
    this.appService.customerUploadFile(formData)
      .pipe(finalize(() => this.uploading = false))
      .subscribe(
        id => {
          localStorage.setItem('phone', this.formInfo.value.phone)
          this.toast.success('Chốt file thành công')
          this.router.navigateByUrl('/view/' + id)
        }
      )
  }

}
