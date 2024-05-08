import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { content } from "./shared/routes/routes";
import { BeeBotComponent } from "./bee-bot/bee-bot.component";

import { LoginComponent } from "./auth/login/login.component";
import { AdminGuard } from './shared/guard/admin.guard';
import { RegisterComponent } from "./auth/register/register.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { UnlockUserComponent } from "./auth/unlock-user/unlock-user.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/single-page',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'chatbot',
    component: BeeBotComponent,
  },




  {
    path: 'activate-account',
    component: UnlockUserComponent,
  },
  {
    path: '',
    component: ContentComponent,
    canActivate: [AdminGuard],
    children: content
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AdminGuard],
    children: full
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [[RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
})],
],
  exports: [RouterModule]
})
export class AppRoutingModule { }

