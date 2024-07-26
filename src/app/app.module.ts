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
import { HttpClientModule } from '@angular/common/http';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
