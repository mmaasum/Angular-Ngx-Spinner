import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouletteComponent } from './modules/components/roulette.component';
import { SpinnService }  from './core/services/spin.service'
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent, RouletteComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, NgxSpinnerModule,BrowserAnimationsModule
  ],
  providers: [HttpClient, SpinnService],
  bootstrap: [AppComponent]
})
export class AppModule { }
