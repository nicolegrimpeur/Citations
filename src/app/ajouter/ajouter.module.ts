import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjouterPageRoutingModule } from './ajouter-routing.module';

import { AjouterPage } from './ajouter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjouterPageRoutingModule
  ],
  declarations: [AjouterPage]
})
export class AjouterPageModule {}
