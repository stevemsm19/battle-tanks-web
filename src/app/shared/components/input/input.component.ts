import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl;
  @Input() errorMessages: Record<string, string> = {};

  get hasError(): boolean {
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }
}
