import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarAdministradorComponent } from './modal-editar-administrador.component';

describe('ModalEditarAdministradorComponent', () => {
  let component: ModalEditarAdministradorComponent;
  let fixture: ComponentFixture<ModalEditarAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEditarAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
