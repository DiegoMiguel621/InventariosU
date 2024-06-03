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
  {path:'**',redirectTo:'login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
