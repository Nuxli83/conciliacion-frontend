import { Routes } from '@angular/router';
import { SuggestionsComponent } from './features/reconciliation/suggestions/suggestions.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { DocumentUploadComponent } from './features/reconciliation/document-upload/document-upload.component';
import { ReconciliationDashboardComponent } from './features/reconciliation/reconciliation-dashboard/reconciliation-dashboard.component';
import { HomeComponent } from './features/layout/components/home/home.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: HomeComponent, 
    canActivate: [authGuard],    
    children: [
      { path: 'conciliacion/sugerencias', component: SuggestionsComponent },
      { path: 'conciliacion/cargar', component: DocumentUploadComponent },
      { path: 'conciliacion/procesar', component: ReconciliationDashboardComponent }
    ]
  },


  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
