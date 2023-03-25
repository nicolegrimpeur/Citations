import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoulettePageRoutingModule } from './roulette-routing.module';

import { RoulettePage } from './roulette.page';
import {EnregistrementComponent} from "../shared/component/roulette/enregistrement/enregistrement.component";
import {JeuComponent} from "../shared/component/roulette/jeu/jeu.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoulettePageRoutingModule
  ],
  declarations: [RoulettePage, EnregistrementComponent, JeuComponent]
})
export class RoulettePageModule {}
