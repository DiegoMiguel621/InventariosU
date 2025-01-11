import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarPersonalComponent } from './modal-eliminar-personal.component';

describe('ModalEliminarPersonalComponent', () => {
  let component: ModalEliminarPersonalComponent;
  let fixture: ComponentFixture<ModalEliminarPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEliminarPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEliminarPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
