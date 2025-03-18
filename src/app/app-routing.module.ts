import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { contentRoute } from './shared/routes/content-routes';
import { authGuard } from './components/auth/auth.guard';

const routes: Routes = [
  {path:"",component:LayoutComponent,children: contentRoute,canActivate: []} 
  // authGuard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
