import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditorMaintenanceComponent } from './vehicle-editor-maintenance.component';

describe('VehicleEditorMaintenanceComponent', () => {
  let component: VehicleEditorMaintenanceComponent;
  let fixture: ComponentFixture<VehicleEditorMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleEditorMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleEditorMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
