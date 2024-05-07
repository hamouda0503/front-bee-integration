import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";

// Menu
export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  // Search Box
  public search: boolean = false;

  // Language
  public language: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    {
      title: "Simple Page",
      icon: "home",
      type: "sub",
      badgeType: "light-primary",
      badgeValue: "2",
      active: true,
      children: [
        { path: "/simple-page/first-page", title: "First Page", type: "link" },
        { path: "/simple-page/second-page", title: "Second Page", type: "link" },
      ],
    },

    { path: "/single-page", icon: "search", title: "Single Page",  active: false, type: "link", bookmark: true },

    // {
    //   title: "Authentication",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/authentication/login/simple", title: "Login Simple", type: "link" },
    //     { path: "/authentication/login/image-one", title: "Login Image 1", type: "link" },
    //     { path: "/authentication/login/image-two", title: "Login Image 2", type: "link" },
    //     { path: "/authentication/login/validation", title: "Login Validation", type: "link" },
    //     { path: "/authentication/login/tooltip", title: "Login Tooltip", type: "link" },
    //     { path: "/authentication/login/sweetalert", title: "Login Sweetalert", type: "link" },
    //     { path: "/authentication/register/simple", title: "Register Simple", type: "link" },
    //     { path: "/authentication/register/image-one", title: "Register Image 1", type: "link" },
    //     { path: "/authentication/register/image-two", title: "Register Image 2", type: "link" },
    //     { path: "/authentication/register/register-wizard", title: "Register wizard", type: "link" },
    //     { path: "/authentication/unlock-user", title: "Unlock User", type: "link" },
    //     { path: "/authentication/forgot-password", title: "Forgot Password", type: "link" },
    //     { path: "/authentication/reset-password", title: "Reset Password", type: "link" },
    //   ],
    // },

    { path: "/tasks", title: "Tasks", icon: "task", type: "link", bookmark: true },
    {
      title: "Users",
      icon: "user",
      type: "sub",
      active: false,
      children: [
        { path: "/user/team-details", title: "All Users", type: "link" },
        { path: "/user/profile", title: "User Profile", type: "link" },
        { path: "/user/edit-profile", title: "Edit Profile", type: "link" },
      ],
    },
    {
      path: "/chat",
      title: "Chat",
      icon: "chat",
      type: "link",
      bookmark: true,
    },
    {
      title: "Project",
      icon: "project",
      type: "sub",
      badgeType: "light-secondary",
      badgeValue: "New",
      active: false,
      children: [
        { path: "/project/list", title: "Project List", type: "link" },
      ],
    },
    {
      title: "Blog",
      icon: "blog",
      type: "sub",
      active: false,
      children: [
        { path: "/blog/details", title: "Blog Details", type: "link" },
        { path: "/blog/add-post", title: "Add Post", type: "link" },
        { path: "/blog/add-event", title: "Add Event", type: "link" },
        { path: "/blog/allsavedpublications", title: "Saved Publications", type: "link" },
        { path: "/blog/product-details", title: "Event Details", type: "link" },
        { path: "/blogcalender", title: "Calender", type: "link" }

      ],
    },
    { path: "/faq", title: "FAQ", icon: "faq", type: "link", active: false },
    { path: "/todo", title: "Todo", icon: "to-do", type: "link" },
    { path: "/calender", title: "Calender", icon: "calender", type: "link", bookmark: true },
    { path: "kanban", title: "Kanban", icon: "layout", type: "link" },

    { path: "tasks/dashboard", title: "Dashboard", icon: "home", type: "link" },
    {
      title: "Authentication",
      type: "sub",
      active: false,
      children: [
        { path: "/authentication/login/simple", title: "Login Simple", type: "link" },
        { path: "/authentication/login/image-one", title: "Login Image 1", type: "link" },
        { path: "/authentication/login/image-two", title: "Login Image 2", type: "link" },
        { path: "/authentication/login/validation", title: "Login Validation", type: "link" },
        { path: "/authentication/login/tooltip", title: "Login Tooltip", type: "link" },
        { path: "/authentication/login/sweetalert", title: "Login Sweetalert", type: "link" },
        { path: "/authentication/register/simple", title: "Register Simple", type: "link" },
        { path: "/authentication/register/image-one", title: "Register Image 1", type: "link" },
        { path: "/authentication/register/image-two", title: "Register Image 2", type: "link" },
        { path: "/authentication/register/register-wizard", title: "Register wizard", type: "link" },
        { path: "/authentication/unlock-user", title: "Unlock User", type: "link" },
        { path: "/authentication/forgot-password", title: "Forgot Password", type: "link" },
        { path: "/authentication/reset-password", title: "Reset Password", type: "link" },
      ],
    },

  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
