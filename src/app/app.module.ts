import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// // // for HttpClient import:
// import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// // // for Router import:
// import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
// // for Core import:
// import { LoadingBarModule } from '@ngx-loading-bar/core';

import { CookieService } from 'ngx-cookie-service';
import {MatChipsModule} from '@angular/material/chips';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OverlayModule } from '@angular/cdk/overlay';
import { RegisterComponent } from './auth/register/register.component';
import { AdminGuard } from './shared/guard/admin.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UnlockUserComponent } from './auth/unlock-user/unlock-user.component';

import {httpInterceptorProviders} from "./_helpers/http.interceptor";
import { ToastrModule } from 'ngx-toastr';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import {environment} from "../environments/environment";
import { BeeBotComponent } from "./bee-bot/bee-bot.component";


import { ErrorInterceptor } from './_helpers/error.interceptor';

//import { MaterialModule } from './material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';


import { CommonModule } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatSliderModule} from '@angular/material/slider';
// import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';


/*chaima*/
import {CdkDrag, CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
/*arsi*/
import { EditRoleComponent } from './components/apps/team/edit-role/edit-role.component';
import { TeamDetailsComponent } from './components/apps/team/team-details/team-details.component';
import { RemoveMemberComponent } from './components/apps/team/remove-member/remove-member.component';
import { CreateTeamComponent } from './components/apps/team/create-team/create-team.component';
import { UpdateTeamComponent } from './components/apps/team/update-team/update-team.component';
import { ShowJoinURLComponent } from './components/apps/chat/show-join-url/show-join-url.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    UnlockUserComponent,
    BeeBotComponent,
    EditRoleComponent,
    TeamDetailsComponent,
    RemoveMemberComponent,
    CreateTeamComponent,
    UpdateTeamComponent,
    ShowJoinURLComponent,

  ],
  imports: [
    MatRadioModule,
    CommonModule,
    NgSelectModule,
    CdkStepperModule,
    CarouselModule,
    MatDialogModule,
    MatExpansionModule,
    NgbAccordionModule,
    NgbModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    FormsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatSlideToggleModule ,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    OverlayModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    SocialLoginModule,
    TablerIconsModule.pick(TablerIcons),
    ToastrModule.forRoot({
      timeOut: 3000, // Time in milliseconds for toast to disappear automatically
      positionClass: 'toast-top-right', // Position of the toast (e.g., 'toast-top-right', 'toast-bottom-right')
      preventDuplicates: true, // Prevent duplicate toasts
      progressBar: true  ,
      toastClass: 'custom-toast' // Optionally add a progress bar
    }),
    CdkDrag,
    CdkDropList,
    // MatToolbar,
    DragDropModule,



// //     // for HttpClient use:
//     LoadingBarHttpClientModule,
// // //     // for Router use:
//      LoadingBarRouterModule
// //     // for Core use:
    // LoadingBarModule,
  ],
  exports: [TablerIconsModule],
  providers: [ CookieService, AdminGuard , httpInterceptorProviders,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GoogleClientID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
