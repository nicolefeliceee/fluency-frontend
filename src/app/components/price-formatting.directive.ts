import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnInit, PipeTransform, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFormatPrice]',
  standalone: true
})
export class PriceFormattingDirective implements OnInit {

  @Input('appFormatPrice') decimalPlaces: string = '1.0-2';

  constructor(private el: ElementRef, private renderer: Renderer2, private decimalPipe: DecimalPipe) {}

  ngOnInit() {
    this.formatElement();
  }

  private formatElement() {
    const element = this.el.nativeElement;
    const value = this.getValue(element);

    if (value && !isNaN(+value)) {
      const formatted = this.decimalPipe.transform(+value, this.decimalPlaces, 'en-US');

      if (this.isInputElement(element)) {
        element.value = formatted?.replace(/,/g, '.') || '';
      } else {
        this.renderer.setProperty(element, 'innerText', formatted?.replace(/,/g, '.') || '');
      }
    }
  }

  private getValue(element: HTMLElement): string {
    return this.isInputElement(element) ? (element as HTMLInputElement).value : element.textContent || '';
  }

  private isInputElement(element: HTMLElement): boolean {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
  }

}
