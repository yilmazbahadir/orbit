import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { HomeComponent } from "./home/home.component";
import { BackgroundComponent } from "./background/background.component";
import { RequestComponent } from "./request/request.component";
import { KeyComponent } from "./keys/key/key.component";
import { AddComponent } from "./keys/add/add.component";
import { MinDirective } from "./core/directives/min.directive";
import { MaxDirective } from "./core/directives/max.directive";
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BackgroundComponent,
    RequestComponent,
    KeyComponent,
    AddComponent,
    MinDirective,
    MaxDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
