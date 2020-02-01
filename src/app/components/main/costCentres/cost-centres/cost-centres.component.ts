import { Component, ViewChild } from '@angular/core';
import { CostCentre } from 'src/app/models/costCentre';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CostCentresService } from 'src/app/services/costCentres/cost-centres.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cost-centres',
  templateUrl: './cost-centres.component.html',
  styleUrls: ['./cost-centres.component.scss']
})
export class CostCentresComponent {

  selectedRowId: string = '-1';
  costCentres: any[];
  displayedColumns: string[];
  usedCompany: string;
  dataSource: MatTableDataSource<CostCentre>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private costCentresService: CostCentresService,
    private toastr: ToastrService,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.displayedColumns = ['name','description', 'active'];
    me.usedCompany = globals.getCompany();
    me.getCostCentresForCompany(me.usedCompany);
  }

  private getCostCentresForCompany(company: string): void {
    const me = this;

    me.globals.maskScreen();
    me.costCentresService.getCostCentres(company)
      .subscribe(costCentres => {
        me.costCentres = costCentres;
        me.dataSource = new MatTableDataSource<CostCentre>(costCentres);
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
