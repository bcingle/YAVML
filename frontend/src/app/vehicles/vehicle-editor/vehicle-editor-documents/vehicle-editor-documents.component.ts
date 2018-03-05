import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-editor-documents',
  templateUrl: './vehicle-editor-documents.component.html',
  styleUrls: ['./vehicle-editor-documents.component.css']
})
export class VehicleEditorDocumentsComponent implements OnInit {

  documents = [];

  constructor() { }

  ngOnInit() {
  }

}
