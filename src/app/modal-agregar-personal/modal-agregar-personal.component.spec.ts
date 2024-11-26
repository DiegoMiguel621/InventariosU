import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarPersonalComponent } from './modal-agregar-personal.component';

describe('ModalAgregarPersonalComponent', () => {
  let component: ModalAgregarPersonalComponent;
  let fixture: ComponentFixture<ModalAgregarPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAgregarPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAgregarPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
