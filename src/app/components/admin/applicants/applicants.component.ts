import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageComponent } from './manage/manage.component';
import { ApplicantsService } from 'src/app/services/admin/applicants.service';
import { Applicant } from 'src/app/models/admin/applicant';

@Component({
	selector: 'app-applicants',
	templateUrl: './applicants.component.html',
	styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit  {
	displayedColumns: string[] = ['firstname', 'gender', 'age', 'contactNumber', 'actions'];
	dataSource!: MatTableDataSource<Applicant>;
	applicatsDataSource: Applicant[] = new Array;
	applicant!: Applicant;
  
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
  
	constructor (public dialog: MatDialog, private applicantsService: ApplicantsService) { }
	ngOnInit(): void {
		if(!this.applicantsService.getApplicantsData()){
			this.loadGeneralApplicants();
		}else{
			this.dataSource = new MatTableDataSource(this.applicantsService.getApplicantsData());
		}
	}
	ngAfterViewInit(){
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	loadGeneralApplicants(): void{
		this.applicantsService.findGeneral().subscribe({
			next: res => {
				this.applicantsService.saveApplicantsData(res);
				this.ngOnInit();
				this.ngAfterViewInit();
			},error: err => {
				console.log(err)
			}
		});
	}
	onManage(applicant: Applicant){
	  const dialogRef = this.dialog.open(ManageComponent,{
		autoFocus: false,
		width: '95vw', //sets width of dialog
		// height:'95vh', //sets width of dialog
		maxWidth: '100vw', //overrides default width of dialog
		// maxHeight: '100vh', //overrides default height of dialog
		disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
	  });
	  dialogRef.componentInstance.applicant = applicant;
	  dialogRef.afterClosed().subscribe(res => {
		this.loadGeneralApplicants();
	  });
	}
  
	onEdit(user: any){
	  // this.populateForm(user);
	  console.log(user)
	}
  
	onDelete(user: any){
	  if(confirm('Are you sure to delete?')){
		console.log(user)
	  }
	}
	applyFilter(event: Event) {
	  const filterValue = (event.target as HTMLInputElement).value;
	  this.dataSource.filter = filterValue.trim().toLowerCase();
  
	  if (this.dataSource.paginator) {
		this.dataSource.paginator.firstPage();
	  }
	}
}