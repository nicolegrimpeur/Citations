import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoulettePage } from './roulette.page';

const routes: Routes = [
  {
    path: '',
    component: RoulettePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoulettePageRoutingModule {}
