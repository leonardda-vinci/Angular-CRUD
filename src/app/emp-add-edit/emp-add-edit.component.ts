import { 
  ChangeDetectionStrategy, 
  ChangeDetectorRef, 
  Component, 
  Inject, 
  OnInit, 
  EventEmitter, 
  Output 
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

interface Education {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-emp-add-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule
    // AppComponent
    // HttpClient
  ],
  templateUrl: './emp-add-edit.component.html',
  styleUrl: './emp-add-edit.component.scss',
  providers: [
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpAddEditComponent implements OnInit {
  @Output() employeeUpdated = new EventEmitter<any>();
  @Output() employeeAdded = new EventEmitter<any>();
  empForm: FormGroup;

  educations: Education[] = [
    {
      value: 'matric', 
      viewValue: 'Matric'
    },
    {
      value: 'diploma', 
      viewValue: 'Diploma'
    },
    {
      value: 'intermediate', 
      viewValue: 'Intermediate'
    },
    {
      value: 'graduate', 
      viewValue: 'Graduate'
    },
    {
      value: 'post graduate', 
      viewValue: 'Post Graduate'
    }
  ];

  constructor(
    private _fb: FormBuilder,
    // private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(HttpClient) private _httpClient: HttpClient,
    private _coreService: CoreService,
    // private _appComponent: AppComponent
  ) { 
    this.empForm = this._fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: '',
      education: '',
      company: '',
      experience: '',
      package: '',
    });
  }
  
  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }
  
  private url = 'http://localhost:3000/employees';
  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
        this._httpClient.put<any>(`${this.url}/${this.data.id}`, this.empForm.value).subscribe({
          next: (data: any) => {
            this.employeeUpdated.emit(data); // emit the event
            this._coreService.openSnackBar('Employee detail updated!');
            this._dialogRef.close(true);
            
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error updating employee: ', err.message);
            this._coreService.openSnackBar('Failed to update employee. Please try again.');
          },
        });
      } else {
        this._httpClient.post<any>(this.url, this.empForm.value).subscribe({
          next: (val: any) => {
            this.employeeAdded.emit(val); // emit the event
            this._coreService.openSnackBar('Employee added successfully!');
            this._dialogRef.close(true);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error adding employee: ', err.message);
            this._coreService.openSnackBar('Failed to add employee. Please try again.');
          },
        });
      }
    }
  }
}
