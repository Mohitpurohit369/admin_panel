import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './physical/category/category.component';
import { SubcategoryComponent } from './physical/subcategory/subcategory.component';
import { AddProductComponent } from './physical/add-product/add-product.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'physical/add-category', component: CategoryComponent },
      { path: 'physical/sub-category', component: SubcategoryComponent },
      { path: 'physical/add-product', component: AddProductComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
