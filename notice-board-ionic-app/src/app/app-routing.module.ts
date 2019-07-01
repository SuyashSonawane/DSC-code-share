import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "notices", pathMatch: "full" },
  {
    path: "auth",
    loadChildren: "./auth/auth.module#AuthPageModule"
  },
  {
    path: "notices",
    loadChildren: "./notices/notices.module#NoticesPageModule"
  },
  {
    path: "starrednotices",
    loadChildren:
      "./starrednotices/starrednotices.module#StarrednoticesPageModule"
  },
  {
    path: "unseennotices",
    loadChildren: "./unseennotices/unseennotices.module#UnseennoticesPageModule"
  },
  {
    path: "mynotices",
    loadChildren: "./mynotices/mynotices.module#MynoticesPageModule"
  },
  {
    path: "**",
    redirectTo: "/notices/tabs/all",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
