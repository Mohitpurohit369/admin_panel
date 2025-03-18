import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { TranscationComponent } from './transcation/transcation.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'orders', component: OrdersComponent },
      { path: 'transactions', component: TranscationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
