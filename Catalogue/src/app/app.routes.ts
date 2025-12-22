import { Routes } from '@angular/router';
import { Catalogue } from './catalogue/catalogue';
import { formation } from './formation/formation';
import { AuthLogin } from './auth-login/auth-login';
import { GestUser } from './gest-user/gest-user';
import { AdminGuard } from './admin.guard';
import { Layout } from './layout/layout';
import { FormateurComponent } from './formateur-component/formateur-component';
import { FormationHistorique } from './formation-historique/formation-historique';

export const routes: Routes = [

  // 🔹 ROUTES WITHOUT SIDEBAR
  {
    path: 'catalogue',
    component: Catalogue
  },
  {
    path: 'login',
    component: AuthLogin
  },

  // 🔹 ROUTES WITH SIDEBAR (LAYOUT)
 {
  path: '',
  component: Layout,
  children: [
    { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
    { path: 'users', component: GestUser  },
    { path: 'formation', component: formation } ,
    { path: 'formateur', component: FormateurComponent },
    { path: 'historique', component: FormationHistorique }
  ]
},

  // fallback
  { path: '**', redirectTo: '' }
];
