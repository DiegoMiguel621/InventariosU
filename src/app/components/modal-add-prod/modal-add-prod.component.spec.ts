import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddProdComponent } from './modal-add-prod.component';

describe('ModalAddProdComponent', () => {
  let component: ModalAddProdComponent;
  let fixture: ComponentFixture<ModalAddProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAddProdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAddProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
