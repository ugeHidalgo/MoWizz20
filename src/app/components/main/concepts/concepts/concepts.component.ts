import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ConceptsService } from 'src/app/services/concepts/concepts.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';
import { Router } from '@angular/router';
import { Concept } from 'src/app/models/concept';

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.component.html',
  styleUrls: ['./concepts.component.scss']
})
export class ConceptsComponent {

  selectedRowId: string = '-1';
  concepts: any[];
  displayedColumns: string[];
  usedCompany: string;
  dataSource: MatTableDataSource<Concept>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private conceptsService: ConceptsService,
    private toastr: ToastrService,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.displayedColumns = ['name','description', 'transactionType', 'active'];
    me.usedCompany = globals.getCompany();
    me.getConceptsForCompany(me.usedCompany);
  }

  private getConceptsForCompany(company: string): void {
    const me = this;

    me.globals.maskScreen();
    me.conceptsService.getConcepts(company)
      .subscribe(concepts => {
        me.concepts = concepts;
        me.dataSource = new MatTableDataSource<Concept>(concepts);
        me.dataSource.paginator = me.paginator;
        me.dataSource.sort = me.sort;
        me.globals.unMaskScreen();
      },
      error => {
        me.globals.unMaskScreen();
        me.toastr.error(error.message);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickAddButton() {
    this.toastr.warning('To be implemented.');
    /* const pathToAccountDetail = `/accountdetail/-1`;

    this.router.navigate([pathToAccountDetail]); */
  }

  onClickEditButton() {
    this.toastr.warning('To be implemented.');
    /* const pathToAccountDetail = `/accountdetail/` + this.selectedRowId;

    this.router.navigate([pathToAccountDetail]); */
  }

  onClickRemoveButton() {
    this.toastr.warning('To be implemented.');
  }

  selectRow(row) {
    this.selectedRowId = row.id;
  }
}
