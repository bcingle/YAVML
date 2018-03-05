import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditorFuelComponent } from './vehicle-editor-fuel.component';

describe('VehicleEditorFuelComponent', () => {
  let component: VehicleEditorFuelComponent;
  let fixture: ComponentFixture<VehicleEditorFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleEditorFuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleEditorFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
