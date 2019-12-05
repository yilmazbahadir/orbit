import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RequestComponent } from './request/request.component';
import { BackgroundComponent } from './background/background.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "request", component: RequestComponent },
  { path: "background", component: BackgroundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
