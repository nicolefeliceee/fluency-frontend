import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPriceFormatting]',
  standalone: true
})
export class PriceFormattingDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, '');

    // Format with dots as thousands separators
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Update the input field value
    this.el.nativeElement.value = formattedValue;
  }

}
