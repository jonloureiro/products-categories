import { ProductDetailComponent } from './views/product-detail/product-detail.component';
import { ProductsComponent } from './views/products/products.component';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './views/categories/categories.component';

// MASTER
// /products

// DETAILS
// /products/add    (create)
// /products/:slug  (read)
// /products/:slug/edit  (update)
// /products/:slug/delete  (delete)

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        component: ProductsComponent,
        children: [
          {
            path: 'add',
            component: ProductDetailComponent,
          },
          {
            path: ':slug',
            component: ProductDetailComponent,
          },
          {
            path: ':slug/edit',
            component: ProductDetailComponent,
          },
          {
            path: ':slug/delete',
            component: ProductDetailComponent,
          }
        ]
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            component: CategoriesComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
