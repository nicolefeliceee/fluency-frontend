import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
  cancelClicked = output<any>();
  confirmClicked = output<any>();

  @Input() projectStatus: any;

  minDate!: string;

  constructor(
    private fb: FormBuilder
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
      id: []
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.inputForm) {

      console.log(this.inputForm);
      this.detailForm.setValue({
        date: this.inputForm['deadlineDate'],
        time: this.inputForm['deadlineTime'],
        note: this.inputForm['note'],
        media: this.inputForm['mediatypeId'],
        id: this.inputForm['tempId']
      })
    } else {

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
      this.detailForm.patchValue({
        media: this.media,
        id: this.id
      })
      this.confirmClicked.emit(this.detailForm);
    }

  }

}
