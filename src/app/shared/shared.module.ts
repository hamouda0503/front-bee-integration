import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// Components
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { FeatherIconsComponent } from "./components/feather-icons/feather-icons.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { ContentComponent } from "./components/layout/content/content.component";
import { FullComponent } from "./components/layout/full/full.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { TapToTopComponent } from "./components/tap-to-top/tap-to-top.component";
// Header Elements Components
import { SearchComponent } from "./components/header/elements/search/search.component";
import { LanguagesComponent } from "./components/header/elements/languages/languages.component";
import { NotificationComponent } from "./components/header/elements/notification/notification.component";
import { BookmarkComponent } from "./components/header/elements/bookmark/bookmark.component";
import { CartComponent } from "./components/header/elements/cart/cart.component";
import { MessageBoxComponent } from "./components/header/elements/message-box/message-box.component";
import { MyAccountComponent } from "./components/header/elements/my-account/my-account.component";

// Services
import { LayoutService } from "./services/layout.service";
import { NavService } from "./services/nav.service";
import { DecimalPipe } from "@angular/common";
import { SvgIconComponent } from "./components/svg-icon/svg-icon.component";
import { SwiperModule } from "swiper/angular";
import { SwiperComponent } from "./components/header/elements/swiper/swiper.component";
// import { BeeBotComponent } from '../bee-bot/bee-bot.component';
import { ToastrModule } from 'ngx-toastr';
import {TableService} from "./services/table.service";
import {NgbdSortableHeader} from "./directives/NgbdSortableHeader";


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    BreadcrumbComponent,
    FeatherIconsComponent,
    FullComponent,
    LoaderComponent,
    TapToTopComponent,
    SearchComponent,
    LanguagesComponent,
    NotificationComponent,
    BookmarkComponent,
    CartComponent,
    MessageBoxComponent,
    MyAccountComponent,
    SvgIconComponent,
    SwiperComponent,
    NgbdSortableHeader

  ],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgbModule, SwiperModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Time in milliseconds for toast to disappear automatically
      positionClass: 'toast-top-right', // Position of the toast (e.g., 'toast-top-right', 'toast-bottom-right')
      preventDuplicates: true, // Prevent duplicate toasts
      progressBar: true   // Optionally add a progress bar
    }),],
  providers: [NavService, LayoutService, DecimalPipe,TableService],
  exports: [NgbModule, FormsModule, ReactiveFormsModule, LoaderComponent, BreadcrumbComponent, FeatherIconsComponent, TapToTopComponent, SvgIconComponent,NgbdSortableHeader, SwiperModule],
})
export class SharedModule {}
