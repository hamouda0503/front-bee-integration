import { Routes } from "@angular/router";

export const content: Routes = [
  // {
  //   path: "dashboard",
  //   loadChildren: () => import("../../components/dashboard/dashboard.module").then((m) => m.DashboardModule),
  // },
  {
    path: "simple-page",
    loadChildren: () => import("../../components/simple-page/simple-page.module").then((m) => m.SimplePageModule),
  },
  {
    path: "single-page",
    loadChildren: () => import("../../components/single-page/single-page.module").then((m) => m.SinglePageModule),
  },
  {
    path: "chat",
    loadChildren: () => import("../../components/apps/chat/chat.module").then((m) => m.ChatModule),
  },
  {
    path: "team",
    loadChildren: () => import("../../components/apps/team/users.module").then((m) => m.UsersModule),
  },
  {
    path: "tasks",
    loadChildren: () => import("../../components/apps/tasks/tasks.module").then((m) => m.TasksModule),
  },
  {
    path: "todo",
    loadChildren: () => import("../../components/apps/todo/todo.module").then((m) => m.TodoModule),
  },
  {
    path: "faq",
    loadChildren: () => import("../../components/apps/faq/faq.module").then((m) => m.FaqModule),
  },
  {
    path: "project",
    loadChildren: () => import("../../components/apps/project/project.module").then((m) => m.ProjectModule),
  },
  {
    path: "blog",
    loadChildren: () => import("../../components/apps/blog/blog.module").then((m) => m.BlogModule),
  },
  {
    path: "calender",
    loadChildren: () => import("../../components/apps/calender/calender.module").then((m) => m.CalenderModule),
  },
  {
    path: 'kanban',
    loadChildren: () => import('../../components/apps/kanban/kanban.module').then((m) => m.KanbanModule)
  },
  {
    path: "blogcalender",
    loadChildren: () => import("../../components/apps/Blogcalender/calender.module").then((m) => m.CalenderModule),
  }
];
