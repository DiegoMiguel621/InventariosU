import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RecuperarContraComponent } from './components/recuperar-contra/recuperar-contra.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { Inventario2Component } from './components/inventario2/inventario2.component';
import { PersonalComponent } from './components/personal/personal.component';
import { ModalforminvComponent } from './components/modalforminv/modalforminv.component';
import { ModalEditarComponent } from './components/modal-editar/modal-editar.component';
import { ModalVerComponent } from './components/modal-ver/modal-ver.component';
import { ModalEliminarComponent } from './components/modal-eliminar/modal-eliminar.component';
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
import { ModalErrorComponent } from './components/modal-error/modal-error.component';
import { ModalExportarReporteComponent } from './components/modal-exportar-reporte/modal-exportar-reporte.component';


const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'header',component:HeaderComponent},
  {path:'footer',component:FooterComponent},
  {path:'recu',component:RecuperarContraComponent},
  {path:'inicio',component:InicioComponent},
  {path:'inventario',component:InventarioComponent},
  {path:'inventario2',component:Inventario2Component},
  {path:'personal',component:PersonalComponent},
  {path:'administradores',component:AdministradoresComponent},
  {path:'aside',component:AsideComponent},


  //modales
  {path:'modal1', component:ModalforminvComponent},
  {path:'modal2',component:ModalEditarComponent},
  {path:'modal3',component:ModalVerComponent},
  {path:'modal4',component:ModalEliminarComponent},
  {path:'modal5',component:ModalAgregarPersonalComponent},
  {path:'modal6',component:ModalVerPersonalComponent},
  {path:'modal7',component:ModalEditarPersonalComponent},
  {path:'modal8',component:ModalEliminarPersonalComponent},
  {path:'modal9',component:ModalAddAdministradorComponent},
  {path:'modal10',component:ModalEliminarAdministradorComponent},
  {path:'modal11',component:ModalEditarAdministradorComponent},
  {path:'modal12',component:ModalFiltrosBienesComponent},
  {path:'modal13',component:ModalErrorComponent},
  {path:'modal14',component:ModalExportarReporteComponent},
  



  {path:'**',redirectTo:'login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
