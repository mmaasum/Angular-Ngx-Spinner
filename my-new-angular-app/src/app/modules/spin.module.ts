import { SpinnService } from '../core/services/spin.service';
import { ErrorHandler, NgModule } from '@angular/core';
import { RouletteComponent } from '../modules/components/roulette.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
	imports: [BrowserModule, HttpClientModule],
	providers: [
		SpinnService, HttpClient
	],
	declarations: [
		RouletteComponent
	],
	exports: []
})

 export class SpinModule { }