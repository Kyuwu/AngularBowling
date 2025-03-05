import { Component, signal, input } from '@angular/core';


@Component({
  selector: 'app-bowling-field',
  standalone: true,
  imports: [],
  templateUrl: './bowling-field.component.html',
  styleUrls: ['./bowling-field.component.scss'],
})
export class BowlingFieldComponent {
  remainingPins = input.required<number>(); // Input signal for remaining pins
}