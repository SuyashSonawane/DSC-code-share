import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "notices", pathMatch: "full" },
  {
    path: "auth",
    loadChildren: "./auth/auth.module#AuthPageModule"
  },
  {
    path: "notices",
    loadChildren: "./notices/notices.module#NoticesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "starrednotices",
    loadChildren:
      "./starrednotices/starrednotices.module#StarrednoticesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "unseennotices",
    loadChildren:
      "./unseennotices/unseennotices.module#UnseennoticesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "mynotices",
    loadChildren: "./mynotices/mynotices.module#MynoticesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: "/notices/tabs/all",
    pathMatch: "full",
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
