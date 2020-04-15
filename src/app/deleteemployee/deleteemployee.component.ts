import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-deleteemployee',
  templateUrl: './deleteemployee.component.html',
  styleUrls: ['./deleteemployee.component.scss']
})
export class DeleteemployeeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteemployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public _empservices: EmployeeService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this._empservices.deletedata(this.data.id, this.data.index);
  }

  ngOnInit(): void {
  }

}
