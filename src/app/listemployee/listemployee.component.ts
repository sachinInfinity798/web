import { Component, TemplateRef, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Employee } from './employee';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeService } from '../services/employee.service';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, NgForm, FormControl, Validators } from '@angular/forms';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from './date.adapter';
const empQuery = gql`
  query employee($Id: String) {
    book(id: $Id) {
      id,
      Name,
      Address,
      DOB,
      Gender,
      City,
      Mobile,
      Email
    }
  }
`;
@Component({
  selector: 'app-listemployee',
  templateUrl: './listemployee.component.html',
  styleUrls: ['./listemployee.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ListemployeeComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Address', 'DOB', 'Gender', 'City', 'Mobile', 'Email', 'actions'];
  //dataSource: Employee[] = [];
  dataSource: Employee[] = [];
  realdata: any = [];
  //dataSource = new MatTableDataSource([]);
  resp: any = [];
  isLoadingResults = true;
  //sortedData;
  totalrow: number;
  pageEvent: any;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  start = 0;
  limit = 10;
  isError = false;
  msg = '';
  msgsuccss = '';
  isSuccess = false;


  editid: any;
  title = 'Add Employee';
  buttontitle = 'Save';
  arryobj: any = [];
  citylist: any;
  private query: QueryRef<any>;
  data: Employee = { id: '', Name: '', Address: '', DOB: new Date(), Gender: '', City: '', Mobile: undefined, Email: '' };

  constructor(private changeDetectorRefs: ChangeDetectorRef, public _empservices: EmployeeService, private apollo: Apollo, public httpClient: HttpClient, public dialog: MatDialog, public datePipe: DatePipe) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('addEmployeeDialog') addEmployeeDialog: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteEmployeeDialog: TemplateRef<any>;

  private addeditEmpDialogRef: MatDialogRef<TemplateRef<any>>;//
  ngOnInit(): void {
    this.listemployee();
    this.listCity();
    this.resetData();
  }
  listemployee() {
    this.apollo.query({
      query: gql`{ listemployees(first:${this.start},limit:${this.limit}) {_id,Name,Address,DOB,Gender,City,Mobile,Email} }`
    }).subscribe(res => {
      this.isError = false;
      this.msg = "";
      this.dataSource = res.data['listemployees'];
      this.realdata = res.data['listemployees'];
      this._empservices.setdata(res.data['listemployees']);
      this.refreceTable();

      this.isLoadingResults = false;
    },
      (error: HttpErrorResponse) => {
        this.isError = true;
        this.msg = "Internal Server error Please start server !";
      })
  }
  refreceTable() {
    this._empservices.emplist.subscribe(resut => {
      this.dataSource = resut;
      this.changeDetectorRefs.detectChanges();
      this.table.renderRows();
    });
  }
  handlePage(e: any) {
    console.log('page', e);
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.limit = this.pageSize;
    this.start = this.currentPage * this.pageSize;
    this.listemployee()
  }
  add() {
    let _this = this;
    _this.resetData();
    _this.changeValueMth();
    _this.isSuccess = false;
    _this.msgsuccss = "";
    this.addeditEmpDialogRef = this.dialog.open(this.addEmployeeDialog, { disableClose: true });
    this.addeditEmpDialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.isSuccess = true;
        this.msgsuccss = "Added Successfully";
        _this.clearmsg();
      }
    });
  }
  Edit(row, index) {
    let _this = this;
    _this.editid = row._id;
    _this.changeValueMth();
    _this.isSuccess = false;
    _this.msgsuccss = "";
    _this.data = row;

    this.addeditEmpDialogRef = this.dialog.open(this.addEmployeeDialog, { disableClose: true });
    this.addeditEmpDialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        _this.isSuccess = true;
        _this.msgsuccss = "Updated Successfully";
        _this.clearmsg();
      }
    });
  }
  delete(row, index) {
    let _this = this;
    _this.editid = row._id;
    _this.isSuccess = false;
    _this.msgsuccss = "";
    this.addeditEmpDialogRef = this.dialog.open(this.deleteEmployeeDialog, { disableClose: true });
    this.addeditEmpDialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        _this.isSuccess = true;
        _this.msgsuccss = "Deleted Successfully";
        _this.clearmsg();
      }
    });
  }

  clearmsg() {
    let _this = this;
    setTimeout(function () { _this.isSuccess = false; _this.msgsuccss = ""; }, 2000);
  }

  //
  onNoClick(): void {
    let obj: any = {};
    let _this = this;
    _this.listemployee();
    _this.addeditEmpDialogRef.close();
    _this.oldDataSet();


  }
  employeeAddupdate() {
    if (this.editid) { this._empservices.updatedata(this.data, this.editid); } else { this._empservices.addData(this.data); }
    this.resetData();
  }
  formControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  listCity() {
    this.apollo.query({
      query: gql`{ citylist {Name} }`
    }).subscribe(res => { this.citylist = res.data['citylist']; })
  }
  changeValueMth() {
    if (this.editid) {
      this.title = 'Edit Employee';
      this.buttontitle = 'Update';
    }
    else {
      this.title = 'Add Employee';
      this.buttontitle = 'Save';
    }
  }
  resetData() {
    console.log('reset data');
    this.editid = undefined;
    this.data = { id: '', Name: '', Address: '', DOB: new Date(), Gender: '', City: '', Mobile: undefined, Email: '' };
  }
  submit() {
    // emppty stuff
  }
  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : this.formControl.hasError('email') ? 'Not a valid email' : '';
  }
  confirmDelete(): void {
    this._empservices.deletedata(this.editid);
    this.editid = undefined;
  }
  oldDataSet() {
    let _this = this;
    this.query = this.apollo.watchQuery({
      query: gql`{ employee(id: "${_this.editid}") {_id,Name,Address,DOB,Gender,City,Mobile,Email} }`
    });

    this.query.valueChanges.subscribe(res => {
      _this.data.Name = res.data['employee'].Name;
      _this.data.Address = res.data['employee'].Address;
      _this.data.DOB = res.data['employee'].DOB;
      _this.data.Gender = res.data['employee'].Gender;
      _this.data.City = res.data['employee'].City;
      _this.data.Mobile = res.data['employee'].Mobile;
      _this.data.Email = res.data['employee'].Email;
      this.table.renderRows();
      _this.resetData();
    });
  }

}


