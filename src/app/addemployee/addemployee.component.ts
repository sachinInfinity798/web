import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Employee } from '../listemployee/employee';
import { EmployeeService } from '../services/employee.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';


@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.scss']
})
export class AddemployeeComponent implements OnInit {
  editid: any;
  title = 'Add Employee';
  buttontitle = 'Save';
  arryobj: any = [];
  citylist: any;

  ngOnInit(): void {
    this.listCity();
    this.changeValueMth();

  }
  listCity() {
    this.apollo.query({
      query: gql`{ citylist {Name} }`
    }).subscribe(res => {

      this.citylist = res.data['citylist'];
      console.log('city list', this.citylist);
    })
  }
  changeValueMth() {
    if (this.editid) {
      this.title = 'Edit Employee';
      this.buttontitle = 'Update';
    }
  }
  constructor(private apollo: Apollo, public _empservices: EmployeeService,
    private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddemployeeComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data.id != undefined) {
      this.editid = this.data.id;
    }

  }

  formControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  Email = new FormControl('', [
    Validators.required,
    Validators.pattern("[^ @]*@[^ @]*"),
    //emailDomainValidator
  ]);


  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : this.formControl.hasError('email') ? 'Not a valid email' : '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public employeeAddupdate(form): void {
    if (this.editid) { this._empservices.updatedata(form.value, this.editid); } else { this._empservices.addData(form.value); }


  }

}
