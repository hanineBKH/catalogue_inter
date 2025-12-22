import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
@NgModule({
  
  imports: [
    FormsModule ,
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes)
    
  ],
  bootstrap: [AppModule]
})
export class AppModule { }
