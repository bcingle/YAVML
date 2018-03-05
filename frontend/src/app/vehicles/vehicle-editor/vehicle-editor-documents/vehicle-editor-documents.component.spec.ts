import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditorDocumentsComponent } from './vehicle-editor-documents.component';

describe('VehicleEditorDocumentsComponent', () => {
  let component: VehicleEditorDocumentsComponent;
  let fixture: ComponentFixture<VehicleEditorDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleEditorDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleEditorDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
