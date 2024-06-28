import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { TitleCasePipe } from '@angular/common';
import { EmployeeService } from './services/employee.service';
import { CoreService } from './core/core.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  employees: any[] = [];
  displayedColumns: string[] = [
    'id', 
    'firstName', 
    'lastName', 
    'email', 
    'dob', 
    'gender', 
    'education', 
    'company', 
    'experience', 
    'package',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    // private _empService: EmployeeService,
    @Inject(HttpClient) private _httpClient: HttpClient,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  openAddEditEmpForm() {
    const dialogRef = this.dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe(() => {
      next: (data: any) => {
        if (data) {
          this.getEmployees();
        }
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getEmployees();
      }
    })
  }

  openEditForm( data: any ) {
    const dialogRef = this.dialog.open(EmpAddEditComponent, {
      data
    });
    
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getEmployees();
      }
    })
  }

  private url = 'http://localhost:3000/employees';

  getEmployees(): void {
    this._httpClient.get<any>(this.url).subscribe({
      next: (data: any) => {
        // console.log('Data retrieve successful: ', data);
        // const employees = data.employees;
        this.employees = data;
        this.dataSource = new MatTableDataSource<any>(this.employees);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error retrieving data: ', err);
        this._coreService.openSnackBar('Failed to retrieve employees');
        
      }
    });
  }

  deleteEmployee(id: number) {
    const deleteUrl = `${this.url}/${id}`;
    this._httpClient.delete<any>(deleteUrl).subscribe({
      next: (data: any) => {
        console.log('Successfully deleted employee');
        this._coreService.openSnackBar('Employee deleted successfully!');
        this.getEmployees(); // Refresh the table after deleting an employee
      },
      error: (err) => {
        console.error('Error deleting employee: ', err);
        this._coreService.openSnackBar('Failed to delete employee. Please try again.')
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}