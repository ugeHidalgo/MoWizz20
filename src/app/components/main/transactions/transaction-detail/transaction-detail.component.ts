import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent {

  title: string;

  constructor(
    private location : Location,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    const me = this,
          id = me.route.snapshot.paramMap.get('id');

    if ( id==='-1' ){
      me.title ="Nuevo movimiento";
    } else {
      me.title ="Editar movimiento";
    }
  }

  private onClickGoBackButton() {
    this.location.back();
  }

  private onClickSaveButton() {
    this.location.back();
  }

  private onClickUnDoButton() {
    this.location.back();
  }

}
