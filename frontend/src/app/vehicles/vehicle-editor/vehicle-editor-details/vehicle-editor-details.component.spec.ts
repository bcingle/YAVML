import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditorDetailsComponent } from './vehicle-editor-details.component';

describe('VehicleEditorDetailsComponent', () => {
  let component: VehicleEditorDetailsComponent;
  let fixture: ComponentFixture<VehicleEditorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleEditorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleEditorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
