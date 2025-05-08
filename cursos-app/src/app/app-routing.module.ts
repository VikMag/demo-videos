import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module'; // Asegúrate de importar el AuthRoutingModule
import { DashboardComponent } from './dashboard/dashboard.component';
import { CursosComponent } from './cursos/cursos.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CatalogosComponent } from './catalogos/catalogos.component';
import { LayoutComponent } from './layout/layout.component';
import { UserCursosComponent } from './dashboard/user-cursos/user-cursos.component';  // Ruta al componente recién creado
import { FeedbackComponent } from './feedback/feedback.component'; // Asegúrate de importar el componente de feedback
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Este guard es el encargado de proteger las rutas
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'cursos', component: CursosComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'catalogos', component: CatalogosComponent },
      { path: 'user-cursos/:id', component: UserCursosComponent },  // Ruta agregada
    ]
  },

  { path: '**', redirectTo: '/login' } // Ruta comodín para cualquier ruta desconocida
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthRoutingModule], // Importar el AuthRoutingModule aquí también
  exports: [RouterModule]
})
export class AppRoutingModule {}
