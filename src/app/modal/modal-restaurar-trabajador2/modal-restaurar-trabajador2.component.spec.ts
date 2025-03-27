import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRestaurarTrabajador2Component } from './modal-restaurar-trabajador2.component';

describe('ModalRestaurarTrabajador2Component', () => {
  let component: ModalRestaurarTrabajador2Component;
  let fixture: ComponentFixture<ModalRestaurarTrabajador2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalRestaurarTrabajador2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalRestaurarTrabajador2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
