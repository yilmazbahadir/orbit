import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { KeyComponent } from './keys/key/key.component';
import { AddComponent } from './keys/add/add.component';
import { RequestComponent } from "./request/request.component";
import { BackgroundComponent } from "./background/background.component";

const routes: Routes = [
  { path: "", component: HomeComponent, data: { isBackUnavailable: true } },
  { path: "keys/add", component: AddComponent },
  { path: "keys/:id", component: KeyComponent },
  { path: "request", component: RequestComponent, data: { isBackUnavailable: true } },
  { path: "background", component: BackgroundComponent, data: { isBackUnavailable: true } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
