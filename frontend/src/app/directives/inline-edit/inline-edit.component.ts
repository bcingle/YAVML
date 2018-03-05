import { Component, OnInit, ViewChild, ElementRef, Input, Renderer, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css']
})
export class InlineEditComponent implements OnInit, ControlValueAccessor {

  @ViewChild('inlineEditControl') inlineEditControl: ElementRef;
  @Input() label = '';
  @Input() type = 'text';
  @Input() required = false;
  @Input() disabled = false;

  private _value = '';
  private preValue = '';
  private editing = false;
  public onChange = Function.prototype;
  public onTouched = Function.prototype;


  constructor( private element: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.onChange(value);
  }

  writeValue(value: string) {
    this._value = value;
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  edit(value) {
    if (this.disabled) {
      return;
    }
    this.preValue = value;
    this.editing = true;
    setTimeout(_ => {
      // focus the element
      this.renderer.invokeElementMethod(this.inlineEditControl, 'focus', []);
    });
  }

}
