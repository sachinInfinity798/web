import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../listemployee/employee';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
const saveemployee = gql`
  mutation addEmployee(
    $Name: String!,
    $Address: String,
    $DOB: Date!,
    $Gender: String!,
    $City: String!,
    $Mobile: ID!,
    $Email: String!,
    ) {
    addEmployee(
      Name: $Name,
      Address: $Address,
      DOB: $DOB,
      Gender: $Gender,
      City: $City,
      Mobile: $Mobile,
      Email: $Email) {
      _id
    }
  }
`;
const updateEmployee = gql`
  mutation updateBook(
    $id: String!,
    $Name: String!,
    $Address: String,
    $DOB: Date!,
    $Gender: String!,
    $City: String!,
    $Mobile: ID!,
    $Email: String!,) {
    updateEmployee(
      id: $id,
      Name: $Name,
      Address: $Address,
      DOB: $DOB,
      Gender: $Gender,
      City: $City,
      Mobile: $Mobile,
      Email: $Email) {
          _id
    }
  }
`;
const deleteemp = gql`
  mutation deleteEmployee($id: String!) {
    deleteEmployee(id:$id) {
      _id
    }
  }
`;
@Injectable()
export class EmployeeService {
    private employees = new BehaviorSubject<any>({});
    cast = this.employees.asObservable();

    constructor(private apollo: Apollo, private httpClient: HttpClient, private datePipe: DatePipe) { }
    setdata(data) {
        this.employees.next(data);
    }
    get emplist() {
        return this.employees.asObservable();
    }
    addData(data: Employee): void {
        let addeddata = data;
        //console.log('date time', this.datePipe.transform(data.DOB, 'yyyy-MM-ddT00:00:00.000Z'));
        this.apollo.mutate({
            mutation: saveemployee,
            variables: {
                Name: data.Name,
                Address: data.Address,
                DOB: this.datePipe.transform(data.DOB, 'yyyy-MM-ddT00:00:00.000Z'),
                Gender: data.Gender,
                City: data.City,
                Mobile: data.Mobile,
                Email: data.Email
            }
        }).subscribe(({ data }) => {
            let recobj = data;
            let allArry: any = []
            this.emplist.subscribe(resut => { allArry = resut });
            addeddata['_id'] = recobj['addEmployee']._id;
            allArry.unshift(addeddata);
            this.setdata(allArry);

        }, (error) => {
            console.log('there was an error sending by server', error);
        });
    }
    updatedata(data: Employee, Id) {
        let updateddata = data;
        let allArry: any = []
        this.apollo.mutate({
            mutation: updateEmployee,
            variables: {
                id: Id,
                Name: data.Name,
                Address: data.Address,
                DOB: this.datePipe.transform(data.DOB, 'yyyy-MM-ddT00:00:00.000Z'),
                Gender: data.Gender,
                City: data.City,
                Mobile: data.Mobile,
                Email: data.Email
            }
        }).subscribe(({ data }) => {
            //console.log('got Updayted data', data['updateEmployee']._id);
            this.emplist.subscribe(resut => { allArry = resut });
            let index = allArry.findIndex(a => a._id == Id);
            updateddata['_id'] = data['updateEmployee']._id;
            allArry[index] = updateddata;
            this.setdata(allArry);
        }, (error) => {
            console.log('there was an error sending by server', error);
        });

    }
    deletedata(id) {
        let allArry: any = []
        const Id = id;
        this.apollo.mutate({
            mutation: deleteemp,
            variables: {
                id: Id
            }
        }).subscribe(({ data }) => {
            this.emplist.subscribe(resut => { allArry = resut });
            let index = allArry.findIndex(a => a._id == Id);
            if (index > -1) { allArry.splice(index, 1); }
            this.setdata(allArry);
        }, (error) => {
            console.log('there was an error sending by server', error);
        });
    }

}