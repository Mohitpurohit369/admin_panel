import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { CategoryComponent } from './physical/category/category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SubcategoryComponent } from './physical/subcategory/subcategory.component';
import { AddProductComponent } from './physical/add-product/add-product.component';



@NgModule({
  declarations: [
   
  
    CategoryComponent,
             SubcategoryComponent,
             AddProductComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class ProductsModule { }
