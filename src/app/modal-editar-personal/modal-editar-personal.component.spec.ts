import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarPersonalComponent } from './modal-editar-personal.component';

describe('ModalEditarPersonalComponent', () => {
  let component: ModalEditarPersonalComponent;
  let fixture: ComponentFixture<ModalEditarPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEditarPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEditarPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
