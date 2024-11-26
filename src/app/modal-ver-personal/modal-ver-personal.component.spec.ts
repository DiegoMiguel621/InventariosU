import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerPersonalComponent } from './modal-ver-personal.component';

describe('ModalVerPersonalComponent', () => {
  let component: ModalVerPersonalComponent;
  let fixture: ComponentFixture<ModalVerPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalVerPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalVerPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
