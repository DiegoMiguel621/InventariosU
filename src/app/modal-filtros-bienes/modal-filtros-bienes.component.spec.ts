import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFiltrosBienesComponent } from './modal-filtros-bienes.component';

describe('ModalFiltrosBienesComponent', () => {
  let component: ModalFiltrosBienesComponent;
  let fixture: ComponentFixture<ModalFiltrosBienesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFiltrosBienesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFiltrosBienesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
