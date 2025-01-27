import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarAdministradorComponent } from './modal-eliminar-administrador.component';

describe('ModalEliminarAdministradorComponent', () => {
  let component: ModalEliminarAdministradorComponent;
  let fixture: ComponentFixture<ModalEliminarAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEliminarAdministradorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEliminarAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
