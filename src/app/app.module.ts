import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RecuperarContraComponent } from './components/recuperar-contra/recuperar-contra.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { PersonalComponent } from './components/personal/personal.component';
import { Inventario2Component } from './components/inventario2/inventario2.component';
import { ModalComponent } from './modal/modal.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ModalforminvComponent } from './components/modalforminv/modalforminv.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ModalEditarComponent } from './components/modal-editar/modal-editar.component';
import { ModalVerComponent } from './components/modal-ver/modal-ver.component';
import { ModalEliminarComponent } from './components/modal-eliminar/modal-eliminar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiBienesService } from '././service/api-bienes.service';
import { ModalAgregarPersonalComponent } from './modal-agregar-personal/modal-agregar-personal.component';
import { ModalVerPersonalComponent } from './modal-ver-personal/modal-ver-personal.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RecuperarContraComponent,
    InicioComponent,
    InventarioComponent,
    PersonalComponent,
    Inventario2Component,
    ModalComponent,
    ModalforminvComponent,
    ModalEditarComponent,
    ModalVerComponent,
    ModalEliminarComponent,
    ModalAgregarPersonalComponent,
    ModalVerPersonalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    ApiBienesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
