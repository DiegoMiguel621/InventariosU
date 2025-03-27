import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRestaurarTrabajadorComponent } from './modal-restaurar-trabajador.component';

describe('ModalRestaurarTrabajadorComponent', () => {
  let component: ModalRestaurarTrabajadorComponent;
  let fixture: ComponentFixture<ModalRestaurarTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalRestaurarTrabajadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalRestaurarTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
