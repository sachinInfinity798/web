import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Employee } from '../listemployee/employee';


@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.scss']
})
export class AddemployeeComponent implements OnInit {
  employeeForm: FormGroup;

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      Name: [null, [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      Address: [null, Validators.required],
      DOB: [null, Validators.required],
      Gender: [null, Validators.required],
      City: [null, Validators.required],
      Mobile: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]]
    });
  }


  constructor(
    private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddemployeeComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee,
  ) { console.log('oooooooooo', this.data); }

  // formControl = new FormControl('', [
  //   Validators.required,
  //   Validators.email,
  //   Validators.pattern("[^ @]*@[^ @]*")
  // ]);
  // email = new FormControl('@', [
  //   Validators.pattern("[^ @]*@[^ @]*"),
  //   //emailDomainValidator
  // ]);


  // getErrorMessage() {
  //   return this.formControl.hasError('required') ? 'Required field' : this.formControl.hasError('email') ? 'Not a valid email' : '';
  // }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    console.log(this.data);
    //this.dataService.addIssue(this.data);
  }

  get f() {
    return this.employeeForm.controls;
  }

  onSubmit(form) {

  }

}
