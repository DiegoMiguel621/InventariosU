import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddAdministradorComponent } from './modal-add-administrador.component';

describe('ModalAddAdministradorComponent', () => {
  let component: ModalAddAdministradorComponent;
  let fixture: ComponentFixture<ModalAddAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAddAdministradorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAddAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
