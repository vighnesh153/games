import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PongComponent } from './games/pong/pong.component';
import { FlappyBlockComponent } from './games/flappy-block/flappy-block.component';
import { SnakeComponent } from './games/snake/snake.component';
import { BrickBreakerComponent } from './games/brick-breaker/brick-breaker.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'pong', component: PongComponent },
  { path: 'flappy-block', component: FlappyBlockComponent },
  { path: 'snake', component: SnakeComponent },
  { path: 'brick-breaker', component: BrickBreakerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
