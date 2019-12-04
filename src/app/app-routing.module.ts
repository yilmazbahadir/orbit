import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AnnounceComponent } from "./announce/announce.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "announce", component: AnnounceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
