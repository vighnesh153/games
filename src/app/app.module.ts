import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { PongComponent } from './games/pong/pong.component';
import { FlappyBlockComponent } from './games/flappy-block/flappy-block.component';
import { SnakeComponent } from './games/snake/snake.component';
import { BrickBreakerComponent } from './games/brick-breaker/brick-breaker.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    PongComponent,
    FlappyBlockComponent,
    SnakeComponent,
    BrickBreakerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
