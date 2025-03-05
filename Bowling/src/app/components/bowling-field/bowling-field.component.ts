import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bowling-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bowling-field.component.html',
  styleUrls: ['./bowling-field.component.scss'],
})
export class BowlingFieldComponent {
  remainingPins = input.required<number>(); // Input signal for remaining pins
}