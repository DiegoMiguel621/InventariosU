import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
import { ModalEditarPersonalComponent } from './modal-editar-personal/modal-editar-personal.component';
import { ModalEliminarPersonalComponent } from './modal-eliminar-personal/modal-eliminar-personal.component';
import { AdministradoresComponent } from './components/administradores/administradores.component';
import { ModalAddAdministradorComponent } from './modal-add-administrador/modal-add-administrador.component';
import { ModalEliminarAdministradorComponent } from './modal-eliminar-administrador/modal-eliminar-administrador.component';
import { ModalEditarAdministradorComponent } from './modal-editar-administrador/modal-editar-administrador.component';
import { ModalFiltrosBienesComponent } from './modal-filtros-bienes/modal-filtros-bienes.component';
import { AsideComponent } from './components/aside/aside.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ModalErrorComponent } from './components/modal-error/modal-error.component';
import { ModalRestaurarTrabajadorComponent } from './modals/modal-restaurar-trabajador/modal-restaurar-trabajador.component';
import { ModalRestaurarTrabajador2Component } from './modal/modal-restaurar-trabajador2/modal-restaurar-trabajador2.component';
import { ModalRestaurarTrabajador3Component } from './components/modal-restaurar-trabajador3/modal-restaurar-trabajador3.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ModalExportarReporteComponent } from './components/modal-exportar-reporte/modal-exportar-reporte.component';
import { ModalTipoResguardoComponent } from './modal-tipo-resguardo/modal-tipo-resguardo.component';
import { ModalCerrarSesionComponent } from './modal-cerrar-sesion/modal-cerrar-sesion.component';
import { ModalErrorFormComponent } from './modal-error-form/modal-error-form.component';





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
    ModalEditarPersonalComponent,
    ModalEliminarPersonalComponent,
    AdministradoresComponent,
    ModalAddAdministradorComponent,
    ModalEliminarAdministradorComponent,
    ModalEditarAdministradorComponent,
    ModalFiltrosBienesComponent,
    AsideComponent,
    ModalErrorComponent,
    ModalRestaurarTrabajadorComponent,
    ModalRestaurarTrabajador2Component,
    ModalRestaurarTrabajador3Component,
    ModalExportarReporteComponent,
    ModalTipoResguardoComponent,
    ModalCerrarSesionComponent,
    ModalErrorFormComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,    
    FormsModule, 
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    ApiBienesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
