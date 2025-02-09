import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../../services/project.service';

@Component({
  selector: 'app-project-detail-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './project-detail-popup.component.html',
  styleUrl: './project-detail-popup.component.css'
})
export class ProjectDetailPopupComponent implements OnInit, OnChanges{

  @Input() display: boolean = false;
  @Input() header!: string;
  @Input() media!: string;
  @Input() id!: number;
  @Input() inputForm?: any;
  @Input() influencerId?: any;
  cancelClicked = output<any>();
  confirmClicked = output<any>();

  @Input() projectStatus: any;

  minDate!: string;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private projectService: ProjectService
  ) {}

  detailForm!: FormGroup;
  submitted = false;

  ngOnInit(): void {

    let today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.detailForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      note: [''],
      media: [''],
      id: [],
      link: [],
      instagramMediaId: []
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.inputForm) {
// buat edit
      // console.log(this.inputForm);
      this.detailForm.setValue({
        date: this.inputForm['deadlineDate'],
        time: this.inputForm['deadlineTime'],
        note: this.inputForm['note'],
        media: this.inputForm['mediatypeId'],
        id: this.inputForm['tempId'],
        link: this.inputForm['link'],
        instagramMediaId: "",
      });
      // console.log(this.detailForm);
    } else {
// reset value ke null tiap mau add new
      if (this.detailForm) {
        this.detailForm.setValue({
          date: null,
          time: null,
          note: null,
          media: null,
          id: null,
        });

        this.detailFormGroup['date'].markAsUntouched();
        this.detailFormGroup['time'].markAsUntouched();
      }
    }
  }

  // for field in detail popup
  detailDateInput: any;
  detailTimeInput: any;
  detailNoteInput: any;

  get detailFormGroup() {
    return this.detailForm.controls;
  }

  cancel() {
    this.cancelClicked.emit(true);
  }

  confirm() {
    this.submitted = true;

    if (this.detailForm.valid) {
      // console.log(this.detailForm);
      this.detailForm.patchValue({
        media: this.media,
        id: this.id,
        instagramMediaId: this.instagramMediaId
      })
      console.log(this.detailForm);
      this.isValidLink = null;
      this.confirmClicked.emit(this.detailForm);
    }
  }

  isValidLink: boolean | null = null; // Validity status (true, false, null)


  instagramMediaId?: any;
  loading: boolean = false;

  verifyLink() {

    if (this.detailForm['value'].link == '' || this.detailForm['value'].link == null) {
      this.isValidLink = null;
      return;
    }

    // check format
    if (!this.isValidURL(this.detailForm['value'].link)) {
      this.isValidLink = false;
      return;
    }

    this.loading = true;


    // check media type
    this.projectService.verifyLink(this.influencerId, this.detailForm['value'].link).subscribe(
      (data) => {
        console.log(data['media_id']);
        console.log(data);
        if (!data['media_id']) {
          this.isValidLink = false;
        } else {
          console.log("valid");
          this.isValidLink = true;
          this.instagramMediaId = data['media_id'];
        }

        this.loading = false;
      }
    )
  }


  isValidURL(url: string): boolean {
    const urlPattern = new RegExp(
      '^https://' + // Ensure it starts with 'https://'
      '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // Domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*' + // Port and path
      '(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?' + // Query string
      '(\\#[-a-zA-Z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(url);
  }

}
