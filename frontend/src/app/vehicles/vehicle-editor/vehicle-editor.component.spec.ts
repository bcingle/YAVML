import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditorComponent } from './vehicle-editor.component';

describe('VehicleDetailsComponent', () => {
  let component: VehicleEditorComponent;
  let fixture: ComponentFixture<VehicleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
