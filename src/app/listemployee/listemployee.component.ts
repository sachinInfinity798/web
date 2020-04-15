import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Employee } from './employee';
import { AddemployeeComponent } from '../addemployee/addemployee.component';
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
import { DeleteemployeeComponent } from '../deleteemployee/deleteemployee.component';

@Component({
  selector: 'app-listemployee',
  templateUrl: './listemployee.component.html',
  styleUrls: ['./listemployee.component.scss']
})
export class ListemployeeComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Address', 'DOB', 'Gender', 'City', 'Mobile', 'Email', 'actions'];
  dataSource: Employee[] = [];
  //dataSource = new MatTableDataSource([]);
  resp: any = {};
  isLoadingResults = true;
  //sortedData;
  totalrow: number;
  pageEvent: any;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  start = 0;
  limit = 100;
  constructor(private changeDetectorRefs: ChangeDetectorRef, public _empservices: EmployeeService, private apollo: Apollo, public httpClient: HttpClient, public dialog: MatDialog, public datePipe: DatePipe) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  @ViewChild(MatTable) table: MatTable<any>;
  ngOnInit(): void {
    this.listemployee();
  }

  listemployee() {
    this.apollo.query({
      query: gql`{ listemployees(first:${this.start},limit:${this.limit}) {_id,Name,Address,DOB,Gender,City,Mobile,Email} }`
    }).subscribe(res => {
      console.log('res', res);
      this.dataSource = res.data['listemployees'];
      this.totalrow = this.dataSource.length
      this._empservices.setdata(res.data['listemployees']);
      this.refreceTable();

      this.isLoadingResults = false;
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

    console.log('check list');
    let dialogRef = this.dialog.open(AddemployeeComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
      }
    });
  }
  Edit(row) {
    const dialogRef = this.dialog.open(AddemployeeComponent, {
      data: { id: row._id, Name: row.Name, Address: row.Address, DOB: row.DOB, Gender: row.Gender, City: row.City, Mobile: row.Mobile, Email: row.Email }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {

      }
    });
  }

  delete(row, index) {

    const dialogRef = this.dialog.open(DeleteemployeeComponent, {
      data: { id: row._id, index: index }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {

      }
    });
  }



}


