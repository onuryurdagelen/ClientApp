import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from './shared/shared.module';
import { PlayComponent } from './pages/play/play.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot(),
    SharedModule
  ],
  providers: [
    { provide: "baseApiUrl", useValue: "http://localhost:5296/api/",multi:true},
    { provide: "baseUrlForFiles", useValue: "http://localhost:5296/", multi: true },
    {provide: HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
