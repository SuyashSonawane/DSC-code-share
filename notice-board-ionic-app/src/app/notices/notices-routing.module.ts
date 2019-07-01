import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NoticesPage } from "./notices.page";

const routes: Routes = [
  {
    path: "tabs",
    component: NoticesPage,
    children: [
      {
        path: "academic",
        children: [
          {
            path: "",
            loadChildren: "./academic/academic.module#AcademicPageModule"
          },
          {
            path: ":noticeId",
            loadChildren: "./detailed/detailed.module#DetailedPageModule"
          }
        ]
      },
      {
        path: "scholarship",
        children: [
          {
            path: "",
            loadChildren:
              "./scholarship/scholarship.module#ScholarshipPageModule"
          },
          {
            path: ":noticeId",
            loadChildren: "./detailed/detailed.module#DetailedPageModule"
          }
        ]
      },
      {
        path: "all",
        children: [
          {
            path: "",
            loadChildren: "./all/all.module#AllPageModule"
          },
          {
            path: ":noticeId",
            loadChildren: "./detailed/detailed.module#DetailedPageModule"
          }
        ]
      },
      {
        path: "news",
        children: [
          {
            path: "",
            loadChildren: "./news/news.module#NewsPageModule"
          },
          {
            path: ":noticeId",
            loadChildren: "./detailed/detailed.module#DetailedPageModule"
          }
        ]
      },
      {
        path: "other",
        children: [
          {
            path: "",
            loadChildren: "./other/other.module#OtherPageModule"
          },
          {
            path: ":noticeId",
            loadChildren: "./detailed/detailed.module#DetailedPageModule"
          }
        ]
      },
      {
        path: "",
        redirectTo: "/notices/tabs/all",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "/notices/tabs/all",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticesRoutingModule {}
