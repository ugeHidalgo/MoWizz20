import { Component, ViewChild } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';
import { TransactionType, TransactionTypes } from 'src/app/models/transactionType';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Transaction } from 'src/app/models/transaction';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from 'src/app/components/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {

  selectedRowId: string = '-1';
  transactions: any[];
  transactionTypes: TransactionType[] = TransactionTypes;
  displayedColumns: string[];
  usedCompany: string;
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private transactionsService: TransactionsService,
    private toastr: ToastrService,
    private globals: GlobalsService,
    private router: Router,
    private dialog: MatDialog
  ) {
    const me = this;
    me.displayedColumns = ['date', 'type', 'amount', 'account', 'costcentre', 'concept', 'comments'];
    me.usedCompany = globals.getCompany();
    me.getTransactionsForCompany(me.usedCompany);
  }

  private getTransactionsForCompany(company: string): void {
    const me = this;

    me.globals.maskScreen();
    me.transactionsService.getTransactionsForCompany(company)
      .subscribe(transactions => {
        me.globals.unMaskScreen();
        me.dataSource = new MatTableDataSource<Transaction>(transactions);
        me.dataSource.paginator = me.paginator;
        me.dataSource.sort = me.sort;
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
    const pathToTransactionDetail = `/transactiondetail/-1`;

    this.router.navigate([pathToTransactionDetail]);
  }

  onClickEditButton() {
    const pathToTransactionDetail = `/transactiondetail/` + this.selectedRowId;

    this.router.navigate([pathToTransactionDetail]);
  }

  onClickRemoveButton() {
    const me = this;
    let dialogRef;

    if (me.selectedRowId==='-1') {
      me.toastr.error('Debe seleccionar un movimiento para borrar.');
      return;
    }

    dialogRef = me.dialog.open(DeleteDialogComponent, {
        width: '250px',
        data: {
          title: 'Confirmar',
          message: 'Va a borrar el movimiento selecciopnado. ¿Está seguro?'
        }
      });
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          me.onDeleteConfirmed();
        }
      });
  }

  onDeleteConfirmed() {
    const me = this;

    me.globals.maskScreen();
    me.transactionsService.deleteTransactionById(me.usedCompany, me.selectedRowId)
      .subscribe(success=> {
        if (success) {
          me.getTransactionsForCompany(me.usedCompany);
          me.globals.unMaskScreen();
          me.toastr.success('Movimiento borrado correctamente.')
        } else {
          me.globals.unMaskScreen();
          me.toastr.error('No se puedo borrar el movimiento. Inténtelo de nuevo.');
        }
      },
      error => {
        me.globals.unMaskScreen();
        me.toastr.error('No se puedo borrar el movimiento. Inténtelo de nuevo: ' + error.message);
      });
  }

  selectRow(row) {
    this.selectedRowId = row.id;
  }
}
